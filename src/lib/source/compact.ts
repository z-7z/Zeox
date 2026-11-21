/** A local lexical source pass, not a compiler or a runtime loader. Never
 * changes identifiers or interprets code inside strings/interpolations. */
export const SOURCE_LIMIT = 512 * 1024;
export type Options = { removeComments: boolean; compactSpacing: boolean; encodeText: boolean };
const encoder = new TextEncoder();
export const byteLength = (text: string) => encoder.encode(text).length;
const isSpace = (ch: string) => /[ \t\r\n\v\f]/.test(ch);

// Lua 5.1 and Luau both accept three-digit decimal byte escapes. Only rewrite
// plain quoted text. Existing escapes, long strings and backticks are copied
// as-is, so their distinct escape/interpolation rules cannot change the value.
const byteEscape = Array.from({ length: 256 }, (_, i) => '\\' + String(i).padStart(3, '0'));
function encodeLiteral(token: string) {
  if (/[\\\r\n]/.test(token)) return token;
  return token[0] + Array.from(encoder.encode(token.slice(1, -1)), b => byteEscape[b]).join('') + token[0];
}

// Reverse the build tool's fully decimal-escaped printable UTF-8 literals only.
// Mixed escapes, arbitrary byte strings and delimiters must stay exactly as written.
const literalDecoder = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });
function readableLiteral(token: string) {
  if (token[1] !== '\\') return token;
  const body = token.slice(1, -1);
  if (!/^(?:\\[0-9]{3})+$/.test(body)) return token;
  const bytes = new Uint8Array(body.length / 4);
  for (let i = 0; i < bytes.length; i++) {
    const n = Number(body.slice(i * 4 + 1, i * 4 + 4));
    if (n > 255) return token;
    bytes[i] = n;
  }
  try {
    const text = literalDecoder.decode(bytes);
    if (/[\\\u0000-\u001f\u007f-\u009f\u2028-\u202e\u2066-\u2069\ufeff]/u.test(text) || text.includes(token[0])) return token;
    return token[0] + text + token[0];
  } catch { return token; }
}

export function compactSource(source: string, options: Options): string {
  if (byteLength(source) > SOURCE_LIMIT) throw new Error('Source must be 512 KiB or smaller.');
  if (!source.trim()) throw new Error('The attached script is empty. Choose a file with Lua or Luau source.');
  return rewrite(source, options, 'build');
}

/** Restore profile: use the same lexer, never obfuscate, and keep the indentation
 * and line endings of surviving lines. The caller bounds and decodes the blob. */
export function cleanLuaSource(source: string): string {
  const bom = source.charCodeAt(0) === 0xfeff ? '\uFEFF' : '';
  return bom + rewrite(source.slice(bom.length), { removeComments: true, compactSpacing: true, encodeText: false }, 'restore');
}

function rewrite(source: string, options: Options, profile: 'build' | 'restore'): string {
  if (source.includes('\0')) throw new Error('Choose a UTF-8 text script, not a binary file.');
  const longOpen = /\[(=*)\[/y;
  function longEnd(pos: number): number | null {
    longOpen.lastIndex = pos;
    const match = longOpen.exec(source);
    if (!match) return null;
    const close = `]${match[1]}]`, end = source.indexOf(close, longOpen.lastIndex);
    if (end < 0) throw new Error('A long string or block comment has no closing bracket.');
    return end + close.length;
  }
  function lineEnd(pos: number) {
    while (pos < source.length && source[pos] !== '\r' && source[pos] !== '\n') pos++;
    return pos;
  }
  function quotedEnd(start: number) {
    for (let i = start + 1; i < source.length; i++) {
      if (source[i] === '\\') i++;
      else if (source[i] === source[start]) return i + 1;
    }
    throw new Error('A quoted string is missing its closing quote.');
  }
  function commentEnd(start: number) { return longEnd(start + 2) ?? lineEnd(start + 2); }
  function templateEnd(start: number, depth = 0): number {
    if (depth > 48) throw new Error('This interpolated string is too deeply nested to compact.');
    let braces = 0, i = start + 1;
    while (i < source.length) {
      const c = source[i];
      if (c === '\\') { i += 2; continue; }
      if (c === '`') { if (!braces) return i + 1; i = templateEnd(i, depth + 1); continue; }
      if (braces) {
        if (c === '"' || c === "'") { i = quotedEnd(i); continue; }
        if (source.startsWith('--', i)) { i = commentEnd(i); continue; }
        if (c === '[') { const end = longEnd(i); if (end !== null) { i = end; continue; } }
      }
      if (c === '{') braces++;
      if (c === '}' && braces) braces--;
      i++;
    }
    throw new Error('An interpolated string is missing its closing delimiter.');
  }

  const out: string[] = [];
  let gap = '', i = 0;
  function flushGap(final = false) {
    if (!gap) return;
    if (!options.compactSpacing) out.push(gap);
    else if (profile === 'restore') {
      const last = Math.max(gap.lastIndexOf('\n'), gap.lastIndexOf('\r'));
      if (last >= 0) {
        const eol = gap[last] === '\n' && gap[last - 1] === '\r' ? '\r\n' : gap[last];
        if (out.length) out.push(eol);
        if (!final) out.push(gap.slice(last + 1));
      } else if (!final) out.push(out.length ? ' ' : gap);
    } else if (out.length) {
      if (/[\r\n]/.test(gap)) out.push('\n');
      else if (!final) out.push(' ');
    }
    gap = '';
  }
  function emit(token: string) { flushGap(); out.push(token); }
  while (i < source.length) {
    const start = i, c = source[i];
    if (isSpace(c)) { do { i++; } while (i < source.length && isSpace(source[i])); gap += source.slice(start, i); continue; }
    if (source.startsWith('--', i)) {
      i = commentEnd(i);
      const comment = source.slice(start, i);
      if (!options.removeComments || /^--[!#@]/.test(comment) || /SPDX-License-Identifier|\bcopyright\b|@license/i.test(comment)) emit(comment);
      else gap += comment.replace(/[^\r\n]+/g, ' '); // always leave a lexical separator
      continue;
    }
    if (c === '"' || c === "'") {
      i = quotedEnd(i); const token = source.slice(start, i);
      emit(profile === 'restore' ? readableLiteral(token) : options.encodeText ? encodeLiteral(token) : token); continue;
    }
    if (start === 0 && source.startsWith('#!')) i = lineEnd(i);
    else if (c === '`') i = templateEnd(i);
    else if (c === '[') i = longEnd(i) ?? i + 1;
    else { do { i++; } while (i < source.length && !isSpace(source[i]) && !'\'"`['.includes(source[i]) && !source.startsWith('--', i)); }
    emit(source.slice(start, i));
  }
  flushGap(true);
  return out.join('');
}
