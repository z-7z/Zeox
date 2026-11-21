import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { readLift } from './read-exf.mjs';

// Synthetic EXF-style text only; nothing here runs Lua or embeds a user's sample.
const stop = 'error("UNRESOLVED: runtime guards and environment have not been recovered")';
const end = '-- UNRESOLVED entry, call bindings, guard behavior and 7 lifted operations.';
const make = (...bodies) => ['-- EXPERIMENTAL PARTIAL LIFT. test fixture', '-- EXF LIFTER REVISION: 12', stop, ...bodies, end, ''].join('\n');
const fn = (id, lines) => [`prototype_${id} = function(arg1)`, ...lines.map(s => '  ' + s), 'end'].join('\n');

test('orders helpers first, names concrete calls and retains parameters, literals and multi-result uncertainty', () => {
  const literal = String.raw`"ملف; -- r1.prototype_9 \"abc\""`;
  const source = make(fn(1, [
    'r8 = UNRESOLVED_CLOSURE(prototype_20)', `r8(${literal})`,
  ]), fn(20, [
    'r1 = arg1; r2 = UNRESOLVED_GETGLOBAL("string").upper',
    'r3 = UNRESOLVED_PACK(r2(r1)) -- unknown results', 'do return r3 end',
  ]));
  const text = readLift('\uFEFF' + source.replaceAll('\n', '\r\n'));
  assert.ok(text.indexOf('[prototype_20;') < text.indexOf('[prototype_1;'));
  assert.ok(text.includes('pack?(global?.string.upper(arg1))'));
  assert.ok(text.includes('helper1 ← closure?(fn20_upper)'));
  assert.ok(text.includes('helper1(' + literal + ')'));
  assert.ok(text.includes(stop));
});

test('does not propagate a guessed callee across an unknown handler, label, jump, call or write', () => {
  for (const barrier of ['error("UNRESOLVED: DECOY_17 at instruction 9")', '::pc_4::', 'goto pc_4', 'r7()', 'r7.x = 3']) {
    const text = readLift(make(fn(0, ['r6 = UNRESOLVED_ENV.first', barrier, 'r6("after")'])));
    assert.ok(text.includes('slot6?("after")'), barrier);
    assert.ok(!text.includes('env?.first("after")'), barrier);
  }
});

test('folds only compiler decoy diagnostics, not ordinary errors, captures, calls or string contents', () => {
  const text = readLift(make(fn(0, [
    'local r1, r2', '::pc_1::', 'error("UNRESOLVED: DECOY_17 at instruction 9")',
    'error("UNRESOLVED: CLOSE at instruction 12")', 'error("DECOY_17: ordinary error")',
    'r1 = "prototype_3; -- unchanged"', 'UNRESOLVED_UPVALUES[2] = r1',
    'if r2 ~= "choice" then goto pc_1 end', 'do return end',
  ])));
  assert.ok(text.includes('unknown decoy stops: 1'));
  assert.ok(!text.includes('DECOY_17 at instruction 9'));
  assert.ok(text.includes('error("UNRESOLVED: CLOSE at instruction 12")'));
  assert.ok(text.includes('error("DECOY_17: ordinary error")'));
  assert.ok(text.includes('capture?[2] ← "prototype_3; -- unchanged"'));
  assert.ok(text.includes('test slot2? ~= "choice"'));
});

test('compound method calls, register reuse and table separators are handled without editing field keys', () => {
  const text = readLift(make(fn(4, [
    'r7 = arg1; r8 = r7.clean; r9 = UNRESOLVED_PACK(r8(r7, ";"))',
    'r1 = "old"; r2 = r1; r1 = "new"; r4(r2, r1)',
    'r3 = {r7 = "a;b"; r9 = "second"}', 'r6 = (r3.r7)(arg1)', 'r6({r7 = "kept"})',
  ])));
  assert.ok(text.includes('pack?(arg1.clean(arg1, ";"))'));
  assert.ok(text.includes('slot4?("old", "new")'));
  assert.ok(text.includes('r7 = "a;b"') && text.includes('r9 = "second"'));
  assert.match(text, /\(items\d+\.r7\)\(arg1\)/);
  assert.match(text, /value\d+\(\{r7 = "kept"\}\)/);
});

test('cycles terminate, prototypes stay separate and no entry path is invented', () => {
  const text = readLift(make(fn(1, ['r1 = UNRESOLVED_CLOSURE(prototype_2)']), fn(2, ['r1 = UNRESOLVED_CLOSURE(prototype_1)'])));
  assert.equal((text.match(/\[prototype_[12];/g) ?? []).length, 2);
  assert.match(text, /NOT executable/);
});

test('rejects wrong versions, missing stop, unsupported strings, extra outer code and truncation', () => {
  const valid = make(fn(0, ['do return end']));
  for (const bad of ['return 1', valid.replace('REVISION: 12', 'REVISION: 99'), valid.replace(stop, ''),
    valid.replace(end, ''), valid.replace('\nend\n', '\n'), valid.replace('do return end', 'r1 = [=[\nfoo\n]=]'),
    valid.replace('do return end', 'r1 = "unfinished'), valid + 'unhandled()', valid + '\0', 'a'.repeat(1024 * 1024 + 1)]) {
    assert.throws(() => readLift(bad));
  }
});

test('CLI leaves the input alone, refuses an existing output, and rejects invalid UTF-8', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lift-reading-'));
  try {
    const input = join(dir, 'sample (2).txt'), output = join(dir, 'reading.txt');
    const cli = fileURLToPath(new URL('./read-exf.mjs', import.meta.url));
    const run = path => spawnSync(process.execPath, [cli, input, path], { encoding: 'utf8' });
    const source = make(fn(7, ['r7 = 1; do return r7 end']));
    await writeFile(input, source);
    assert.equal(run(output).status, 0);
    assert.equal(await readFile(output, 'utf8'), readLift(source));
    assert.notEqual(run(input).status, 0); assert.notEqual(run(output).status, 0);
    assert.equal(await readFile(input, 'utf8'), source);
    await writeFile(input, Buffer.from([0xff]));
    const badOutput = join(dir, 'bad.txt'); assert.notEqual(run(badOutput).status, 0);
    await assert.rejects(readFile(badOutput), { code: 'ENOENT' });
  } finally { await rm(dir, { recursive: true, force: true }); }
});
