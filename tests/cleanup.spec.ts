import { expect, test } from '@playwright/test';
import { cleanRestoredFile } from '../src/lib/vault/cleanup';
import { compactSource } from '../src/lib/source/compact';
import { READING_LIMIT } from '../src/lib/source/exf-reading.mjs';

const clean = (name: string, bytes: BlobPart) => cleanRestoredFile({ name, blob: new Blob([bytes]) });

test('source cleanup keeps indentation, BOM, CRLF, directives, notices and literal boundaries', async () => {
  const header = '\uFEFF#!/usr/bin/env lua\r\n--!strict\r\n--[[ SPDX-License-Identifier: MIT ]]\r\n';
  const literal = '[=[  -- not a comment\r\n\r\n  text  ]=]', template = '`keep   -- this {f("--x")}`';
  const source = header + '  -- remove me\r\n  local    a = ' + literal + '\r\n\r\n\treturn   a - --[[gap]] -b, ' + template + ' -- tail\r\n';
  const expected = header + '  local a = ' + literal + '\r\n\treturn a - -b, ' + template + '\r\n';
  const result = await clean('config.LUAU', source);
  expect(result.kind).toBe('source'); expect(result.file?.name).toBe('config.clean.LUAU');
  const bytes = await result.file!.blob.arrayBuffer(); expect(Buffer.from(bytes).toString()).toBe(expected);
  expect((await clean('config.luau', bytes)).kind).toBe('unchanged');
});

test('reverses the local encoder for printable strings only, without interpreting other escape forms', async () => {
  const source = 'return "مرحبا -- Orbit", "🌙"';
  const encoded = compactSource(source, { encodeText: true, compactSpacing: true, removeComments: true });
  const tail = String.raw`, "\000", "\255", "\999", "\034", "\092", "mixed\097", "\x41", [=[\065]=]`;
  const result = await clean('built.obf.lua', encoded + tail);
  expect(await result.file!.blob.text()).toBe(source + tail);
});

test('binary, unsupported and malformed inputs are never offered as cleaned source', async () => {
  for (const [name, bytes] of [
    ['place.rbxlx', '<roblox>-- keep</roblox>'], ['bad.lua', new Uint8Array([0xc3, 0x28])],
    ['chunk.lua', '\x1bLua'], ['binary.luau', 'x\0y'], ['unfinished.lua', 'return [=[not closed'],
    ['list.partial.lua.txt', 'return 1'], ['version.lua', '-- EXPERIMENTAL PARTIAL LIFT.\n-- EXF LIFTER REVISION: 99\nreturn 1'],
  ] as const) {
    const result = await clean(name, bytes); expect(result.kind, name).toBe('skipped'); expect(result.file).toBeUndefined();
  }
  for (const source of ['', 'return 42\n']) {
    const result = await clean('same.lua', source); expect(result.kind).toBe('unchanged'); expect(result.file).toBeUndefined();
  }
});

test('cleanup has its own byte limit and refuses oversize text and Studio assets before reading them', async () => {
  const atLimit = 'return  1'.padEnd(READING_LIMIT, ' ');
  expect(await (await clean('boundary.lua', atLimit)).file!.blob.text()).toBe('return 1');
  for (const name of ['large.lua', 'model.rbxmx']) {
    const blob = new Blob([name === 'large.lua' ? atLimit + ' ' : 'return 1']);
    blob.arrayBuffer = () => { throw new Error('should never read these bytes'); };
    const result = await cleanRestoredFile({ name, blob });
    expect(result.kind).toBe('skipped'); expect(result.message).toContain(name === 'large.lua' ? '1 MiB' : 'Roblox');
  }
});
