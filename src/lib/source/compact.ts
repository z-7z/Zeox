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

export function compactSource(source: string, options: Options): string {
  if (byteLength(source) > SOURCE_LIMIT) throw new Error('Source must be 512 KiB or smaller.');
  if (!source.trim()) throw new Error('Paste a script, open a source file, or load the example first.');
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
  function emit(token: string) {
    if (gap) {
      if (!options.compactSpacing) out.push(gap);
      else if (out.length) out.push(/[\r\n]/.test(gap) ? '\n' : ' ');
      gap = '';
    }
    out.push(token);
  }
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
      emit(options.encodeText ? encodeLiteral(token) : token); continue;
    }
    if (start === 0 && source.startsWith('#!')) i = lineEnd(i);
    else if (c === '`') i = templateEnd(i);
    else if (c === '[') i = longEnd(i) ?? i + 1;
    else { do { i++; } while (i < source.length && !isSpace(source[i]) && !'\'"`['.includes(source[i]) && !source.startsWith('--', i)); }
    emit(source.slice(start, i));
  }
  if (!options.compactSpacing) out.push(gap);
  else if (out.length && /[\r\n]/.test(gap)) out.push('\n');
  return out.join('');
}
