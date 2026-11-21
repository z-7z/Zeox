// Offline *reading* pass over an EXF v12 compact text listing, not a Lua parser or VM.
// Records expressions at visible call/write/return sites. Never imports or evaluates input.
export const READING_LIMIT = 1024 * 1024;
const encoder = new TextEncoder();
const guard = 'error("UNRESOLVED: runtime guards and environment have not been recovered")';
const slot = /^r\d+$/;
const identifier = /^[A-Za-z_]\w*$/;
const lex = /"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|--.*|\[=*\[|[A-Za-z_]\w*|\d+(?:\.\d+)?|\.\.\.|\.\.|::|~=|==|<=|>=|[^\s]/g;
const shorthands = new Map(Object.entries({
  UNRESOLVED_ENV: 'env?', UNRESOLVED_GETGLOBAL: 'global?', UNRESOLVED_UPVALUES: 'capture?',
  UNRESOLVED_PACK: 'pack?', UNRESOLVED_UNPACK: 'unpack?', UNRESOLVED_CLOSURE: 'closure?',
}));

function tokenize(line, lineNo) {
  const tokens = [];
  for (const [t] of line.matchAll(lex)) {
    if (/^--\[=*\[|^\[=*\[$|^["'`]$/.test(t)) {
      throw new Error(`Unsupported literal/comment at line ${lineNo}; use the compact single-line EXF listing.`);
    }
    if (t.startsWith('--')) break;
    tokens.push(t);
  }
  return tokens;
}

function parse(text) {
  if (encoder.encode(text).byteLength > READING_LIMIT || text.includes('\0')) throw new Error('Expected a UTF-8 text listing up to 1 MiB.');
  const lines = text.replace(/^\uFEFF/, '').split(/\r\n|\n|\r/);
  if (!lines[0].startsWith('-- EXPERIMENTAL PARTIAL LIFT.') || !lines.slice(0, 8).includes('-- EXF LIFTER REVISION: 12')) {
    throw new Error('Expected an EXF v12 partial lift, not ordinary Lua or obfuscated bytecode.');
  }
  const functions = new Map();
  let fn, guarded = false, unresolved;
  for (const [i, line] of lines.entries()) {
    const n = i + 1;
    if (line.length > 16384) throw new Error(`Line ${n} exceeds the compact-listing limit.`);
    const t = tokenize(line, n);
    if (!t.length) {
      const footer = /^-- UNRESOLVED entry, call bindings, guard behavior and (\d+) lifted operations\.$/.exec(line);
      if (footer) {
        if (fn || !functions.size || unresolved !== undefined) throw new Error(`Unexpected footer at line ${n}.`);
        unresolved = footer[1];
      }
      continue;
    }
    if (unresolved !== undefined) throw new Error(`Unexpected code after the footer at line ${n}.`);
    if (!fn) {
      if (!functions.size && line.trim() === guard) { guarded = true; continue; }
      // Only the known declaration preamble may be omitted outside function bodies.
      if (!functions.size && /^local (?:UNRESOLVED_\w+|prototype_\d+)(?:, (?:UNRESOLVED_\w+|prototype_\d+))*(?: = nil(?:, nil)*)?$/.test(t.join(' ').replace(/ ,/g, ','))) continue;
      const head = /^(prototype_\d+) = function\(([^()]*)\)\s*$/.exec(line);
      if (!guarded || !head || functions.has(head[1]) || !/^(?:(?:arg\d+|\.\.\.)(?:, (?:arg\d+|\.\.\.))*)?$/.test(head[2])) {
        throw new Error(`Unexpected preamble or prototype declaration at line ${n}. No output written.`);
      }
      fn = { id: head[1], args: head[2], start: n, rows: [], deps: new Set(), hints: new Set() };
      functions.set(fn.id, fn);
    } else if (/^end\s*$/.test(line)) {
      fn.end = n; fn = undefined;
    } else {
      if (!/^\s/.test(line)) throw new Error(`Unrecognised function boundary at line ${n}.`);
      fn.rows.push({ t, n });
      for (const [j, token] of t.entries()) {
        if (t[j - 1] !== '.' && /^prototype_\d+$/.test(token)) fn.deps.add(token);
        if (t[j - 1] === '.' && token.length <= 24 && identifier.test(token) && !['table', 'string', 'math'].includes(token)) fn.hints.add(token);
      }
    }
  }
  if (fn || !functions.size || !guarded || unresolved === undefined) throw new Error('Incomplete EXF listing. No output written.');
  return { functions, unresolved };
}

// Presentation order only: show referenced prototypes before their users when possible.
function ordered(functions) {
  const result = [], seen = new Set();
  for (const root of functions.keys()) {
    const work = [[root, false]];
    while (work.length) {
      const [id, visited] = work.pop(), fn = functions.get(id);
      if (visited) { result.push(fn); continue; }
      if (!fn || seen.has(id)) continue;
      seen.add(id); work.push([id, true]);
      for (const dep of [...fn.deps].reverse()) work.push([dep, false]);
    }
  }
  return result;
}

function expression(tokens, values, names) {
  let result = '', prev = '';
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    let word = t;
    const fieldKey = tokens[i + 1] === '=' && ['{', ',', ';'].includes(prev);
    if (prev !== '.' && prev !== ':' && !fieldKey) {
      if (t === 'UNRESOLVED_GETGLOBAL' && tokens[i + 1] === '(' && /^"[A-Za-z_]\w*"$/.test(tokens[i + 2] ?? '') && tokens[i + 3] === ')') {
        word = 'global?.' + tokens[i + 2].slice(1, -1); i += 3;
      } else if (slot.test(t)) word = values.get(t) ?? `slot${t.slice(1)}?`;
      else word = names.get(t) ?? shorthands.get(t) ?? t;
    }
    // Space tokens, never the interior of a quoted literal (including escaped quotes/semicolons).
    if (result && !['.', ':', ',', ')', ']', '}', '(', '[', ';'].includes(t) && !['.', ':', '(', '[', '{', '#'].includes(prev)) result += ' ';
    result += word; prev = tokens[i];
  }
  return result;
}

// Inline only the small, recognised expression grammar. An unfamiliar RHS stays a
// visible event instead of being classified as a disposable register move.
function simple(rhs) {
  const atom = t => /^(?:r\d+|arg\d+|\d+(?:\.\d+)?|true|false|nil|\.\.\.)$/.test(t) || /^['"]/.test(t);
  return (rhs.length === 1 && atom(rhs[0])) ||
    (rhs.length === 2 && ['-', '#', 'not'].includes(rhs[0]) && atom(rhs[1])) ||
    (rhs.length === 3 && atom(rhs[0]) && ['+','-','*','/','%','..','^'].includes(rhs[1]) && atom(rhs[2])) ||
    (rhs.length === 3 && (slot.test(rhs[0]) || rhs[0] === 'UNRESOLVED_ENV') && rhs[1] === '.' && identifier.test(rhs[2])) ||
    (rhs.length === 4 && (slot.test(rhs[0]) || rhs[0] === 'UNRESOLVED_UPVALUES') && rhs[1] === '[' && atom(rhs[2]) && rhs[3] === ']') ||
    (rhs.length === 6 && rhs[0] === 'UNRESOLVED_GETGLOBAL' && rhs[1] === '(' && /^"[A-Za-z_]\w*"$/.test(rhs[2]) && rhs[3] === ')' && rhs[4] === '.' && identifier.test(rhs[5]));
}

function* statements(tokens) {
  let start = 0, depth = 0;
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === 'if' && i === start) break; // includes any transfer in the then/else arm
    if (['(', '[', '{'].includes(t)) depth++;
    else if ([')', ']', '}'].includes(t)) depth--;
    else if (!depth && t === ';') {
      if (i > start) yield tokens.slice(start, i);
      start = i + 1;
    }
  }
  if (start < tokens.length) yield tokens.slice(start);
}

function assignmentAt(tokens) {
  let depth = 0;
  for (const [i, t] of tokens.entries()) {
    if (t === '=' && !depth) return i;
    if (['(', '[', '{'].includes(t)) depth++;
    if ([')', ']', '}'].includes(t)) depth--;
  }
  return -1;
}

function outline(fn, names) {
  const out = [], values = new Map(), literals = new Set();
  let stops = 0, labels = 0, transfers = 0, emptyReturns = 0, seq = 0;
  const show = t => expression(t, values, names);
  for (const { t, n } of fn.rows) {
    const raw = t.join(' '), emit = s => out.push(`  L${n}  ${s}`);
    if (/^local r\d+(?: , r\d+)*$/.test(raw)) continue;
    if (/^:: pc_\d+ ::$/.test(raw)) { labels++; values.clear(); continue; }
    if (/^error \( "UNRESOLVED: DECOY_\d+ at instruction \d+" \)$/.test(raw)) { stops++; values.clear(); continue; }
    // Generated lines can contain a move, a method lookup AND a call. Never split in a string.
    for (const s of statements(t)) {
      const code = s.join(' ');
      if (/^goto pc_\d+$/.test(code)) { transfers++; values.clear(); continue; }
      if (/^if .+ then (?:goto pc_\d+|r\d+ = r\d+(?: ; goto| else goto) pc_\d+) end$/.test(code)) {
        const condition = s.slice(1, s.indexOf('then'));
        // Keep literal string tests (often application branches). Do not evaluate any branch.
        if (condition.some(t => t.startsWith('"') || t.startsWith("'")) || condition.includes('(')) emit(`test ${show(condition)}`);
        transfers++; values.clear(); continue;
      }
      if (s[0] === 'do' && s[1] === 'return' && s[s.length - 1] === 'end') {
        if (s.length > 3) emit('return ' + show(s.slice(2, -1))); else emptyReturns++;
        values.clear(); continue;
      }
      if (s[0] === 'if') { emit(`source: ${code}`); values.clear(); continue; }
      // '=' inside a call's table constructor is a key, not a statement assignment.
      const eq = identifier.test(s[0]) && s[1] !== '(' ? assignmentAt(s) : -1;
      if (eq < 1) { emit(show(s)); values.clear(); continue; } // includes ordinary errors/calls
      const lhs = s.slice(0, eq), rhs = s.slice(eq + 1);
      if (!/^r\d+(?: , r\d+)*$/.test(lhs.join(' '))) {
        emit(`${show(lhs)} ← ${show(rhs)}`); values.clear(); continue; // table/capture write or unknown statement
      }
      const destinations = lhs.filter(t => t !== ',');
      if (rhs.length === 1 && /^['"]/.test(rhs[0]) && !literals.has(rhs[0])) {
        // A later unknown handler may invalidate an alias. Keep literal evidence
        // without attributing that value to a later call across the barrier.
        literals.add(rhs[0]); emit(`literal ${rhs[0]}`);
      }
      const wrapper = /^function \( \.\.\. \) return (prototype_\d+) \( \.\.\. \) end$/.exec(rhs.join(' '));
      const value = wrapper ? `closure?(${names.get(wrapper[1]) ?? wrapper[1]})` : show(rhs);
      const canInline = simple(rhs);
      if (!canInline || destinations.length > 1 || value.length > 88) {
        const kind = wrapper || rhs[0] === 'UNRESOLVED_CLOSURE' ? 'helper' : rhs[0] === '{' ? 'items' : 'value';
        const ids = destinations.map(() => `${kind}${++seq}`);
        emit(`${ids.join(', ')} ← ${value}`);
        if (!wrapper && !canInline) values.clear();
        destinations.forEach((reg, k) => values.set(reg, ids[k]));
      } else {
        // Snapshots of *expressions*, not mutable aliases to the current contents of a slot.
        values.set(lhs[0], rhs.some(t => ['+', '-', '*', '/', '%', '..', '^', '#', 'not'].includes(t)) ? `(${value})` : value);
      }
    }
  }
  return [`${names.get(fn.id)}(${fn.args})  [${fn.id}; L${fn.start}–${fn.end}]`, ...out,
    `  folded: ${labels} labels, ${transfers} transfers, ${emptyReturns} bare returns; unknown decoy stops: ${stops}`].join('\n');
}

export function readLift(text) {
  const { functions, unresolved } = parse(text);
  const names = new Map(Array.from(functions, ([id, fn]) => [id, [id.replace('prototype_', 'fn'), ...[...fn.hints].slice(0, 2)].join('_')]));
  return [
    'EXF v12 • static reading fragments • NOT executable or equivalent Lua',
    `Original entry stop: ${guard}`,
    'Calls, writes and return values by prototype, NOT an execution trace. L = line in the input.',
    'Dispatch, register setup and most predicates omitted. ? = unknown slot, lookup, binding or arity.',
    'Aliases describe local expressions only; names are editorial. Folded operations may have effects.',
    ...(unresolved ? [`Lifter reports ${unresolved} unresolved operations.`] : []), '',
    ordered(functions).map(fn => outline(fn, names)).join('\n\n'), '',
  ].join('\n');
}
