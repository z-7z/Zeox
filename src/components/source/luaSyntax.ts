import { HighlightStyle, StreamLanguage, syntaxHighlighting, type StringStream } from '@codemirror/language';
import { tags } from '@lezer/highlight';

// Display only. Incomplete code is normal while typing. Nothing here validates,
// transforms or executes the document. Immutable frames survive incremental reparses.
type Frame = { kind: 'comment' | 'string' | 'quote' | 'template' | 'expression'; end: string; parent: Frame | null };
interface LexState { frame: Frame | null }
const words = (list: string) => new Set(list.split(' '));
const keywords = words('and break do else elseif end for function if in local not or repeat return then until while');
const luauKeywords = words('continue export type typeof');
const typeNames = words('any boolean buffer never number string thread unknown vector');
const builtins = words('assert coroutine error game ipairs math next pairs pcall print require script select setmetatable string table task tonumber tostring type workspace');
const numeric = /^(?:0[xX][\da-fA-F_]+(?:\.(?!\.)[\da-fA-F_]*)?(?:[pP][+-]?[\d_]+)?|0[bB][01_]+|(?:\d[\d_]*(?:\.(?!\.)[\d_]*)?|\.\d[\d_]*)(?:[eE][+-]?[\d_]+)?)/;

function inLong(stream: StringStream, state: LexState, frame: Frame) {
  const at = stream.string.indexOf(frame.end, stream.pos);
  if (at < 0) stream.skipToEnd();
  else { stream.pos = at + frame.end.length; state.frame = frame.parent; }
  return frame.kind;
}
function inQuote(stream: StringStream, state: LexState, frame: Frame) {
  while (!stream.eol()) {
    const c = stream.next();
    if (c === frame.end) break;
    if (c === '\\') { if (stream.eol()) return 'string'; stream.next(); }
  }
  state.frame = frame.parent;
  return 'string';
}
function inTemplate(stream: StringStream, state: LexState, frame: Frame) {
  if (stream.eat('{')) { state.frame = { kind: 'expression', end: '}', parent: frame }; return 'brace'; }
  while (!stream.eol() && stream.peek() !== '{') {
    const c = stream.next();
    if (c === '`') { state.frame = frame.parent; break; }
    if (c === '\\') stream.next();
  }
  return 'string';
}
function mode(luau: boolean) {
  return StreamLanguage.define<LexState>({
    name: luau ? 'Luau' : 'Lua',
    startState: () => ({ frame: null }),
    token(stream, state) {
      const frame = state.frame;
      if (frame?.kind === 'string' || frame?.kind === 'comment') return inLong(stream, state, frame);
      if (frame?.kind === 'quote') return inQuote(stream, state, frame);
      if (frame?.kind === 'template') return inTemplate(stream, state, frame);
      if (stream.eatSpace()) return null;
      const long = stream.match(/^(--)?\[(=*)\[/);
      if (Array.isArray(long)) {
        state.frame = { kind: long[1] ? 'comment' : 'string', end: `]${long[2]}]`, parent: frame };
        return inLong(stream, state, state.frame);
      }
      if (stream.match('--!')) { stream.skipToEnd(); return 'processingInstruction'; }
      if (stream.match('--')) { stream.skipToEnd(); return 'comment'; }
      const quote = stream.eat(/["']/);
      if (quote) { state.frame = { kind: 'quote', end: quote, parent: frame }; return inQuote(stream, state, state.frame); }
      if (luau && stream.eat('`')) { state.frame = { kind: 'template', end: '`', parent: frame }; return 'string'; }
      if (frame?.kind === 'expression') {
        if (stream.eat('{')) { state.frame = { ...frame, parent: frame }; return 'brace'; }
        if (stream.eat('}')) { state.frame = frame.parent; return 'brace'; }
      }
      if (stream.match(numeric)) return 'number';
      if (stream.match(/^[A-Za-z_]\w*/)) {
        const id = stream.current();
        if (keywords.has(id) || (luau && luauKeywords.has(id))) return 'keyword';
        if (id === 'true' || id === 'false' || id === 'nil') return 'atom';
        if (luau && typeNames.has(id)) return 'typeName';
        if (builtins.has(id) || stream.match(/^\s*\(/, false)) return 'variableName.function';
        return 'variableName';
      }
      stream.next(); return 'punctuation';
    },
    languageData: { commentTokens: { line: '--', block: { open: '--[[', close: ']]' } } },
  });
}
export const luaSyntax = { lua: mode(false), luau: mode(true) };
export const codeColors = syntaxHighlighting(HighlightStyle.define([
  { tag: tags.keyword, class: 'sx-keyword' }, { tag: tags.string, class: 'sx-string' },
  { tag: [tags.number, tags.atom], class: 'sx-literal' }, { tag: tags.comment, class: 'sx-comment' },
  { tag: tags.processingInstruction, class: 'sx-directive' }, { tag: tags.typeName, class: 'sx-type' },
  { tag: tags.function(tags.variableName), class: 'sx-function' }, { tag: tags.punctuation, class: 'sx-punct' },
]));
