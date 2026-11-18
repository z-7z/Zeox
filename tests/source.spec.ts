import { expect, test } from '@playwright/test';
import { byteLength, compactSource, SOURCE_LIMIT } from '../src/lib/source/compact';

const both = { removeComments: true, compactSpacing: true, encodeText: false };
test('compacts trivia without merging tokens or changing strings', () => {
  const lua = `--!strict\r\n-- note\r\nlocal   msg = [==[ \n-- inside\r\n ]==]\nlocal q = "-- spaces   and \\\"quotes\\\"" -- after\nreturn a - --[=[ multibracket ]=] -b, msg, q\n`;
  expect(compactSource(lua, both)).toBe('--!strict\nlocal msg = [==[ \n-- inside\r\n ]==]\nlocal q = "-- spaces   and \\\"quotes\\\""\nreturn a - -b, msg, q\n');
  expect(compactSource('return a--[[separator]]and b', both)).toBe('return a and b');
  expect(compactSource(lua, { removeComments: false, compactSpacing: false, encodeText: false })).toBe(lua);
});

test('preserves Luau interpolations, shebangs and license notices verbatim', () => {
  const template = '`line \\` -- kept {fun({ k = `nested {"}"}` }, [=[}]=]) -- inside interpolation\n }`';
  const header = '#!/usr/bin/env lua\n--[[\nSPDX-License-Identifier: MIT\n]]\n--!native\n';
  const source = header + '  local   s = ' + template + ' -- expendable\n  return   s';
  expect(compactSource(source, both)).toBe(header + 'local s = ' + template + '\nreturn s');
  expect(compactSource('  -- keep me\n  return   1', { removeComments: false, compactSpacing: true, encodeText: false })).toBe('-- keep me\nreturn 1');
});

test('rejects oversized, empty, binary and unterminated inputs', () => {
  expect(byteLength('ملف')).toBe(6);
  for (const source of ['', '  \t', '\0', 'x'.repeat(SOURCE_LIMIT + 1), 'أ'.repeat(SOURCE_LIMIT / 2 + 1), 'return [==[dangling]=]', '--[=[unfinished', 'return "bad', 'return `bad {']) {
    expect(() => compactSource(source, both)).toThrow();
  }
});

test('optional literal rewriting round-trips UTF-8 bytes and skips existing escape forms', () => {
  const literal = 'ملف 01 🌙';
  const built = compactSource(`return "${literal}"`, { ...both, encodeText: true });
  const raw = built.slice('return "'.length, -1);
  expect(raw).toMatch(/^(?:\\\d{3})+$/);
  expect(Buffer.from(raw.split('\\').slice(1).map(Number)).toString('utf8')).toBe(literal);
  const kept = 'return "a\\nb", [=[long text]=], `hello {name}`';
  expect(compactSource(kept, { ...both, encodeText: true })).toBe(kept);
});
