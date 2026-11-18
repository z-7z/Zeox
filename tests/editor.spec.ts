import { expect, test } from '@playwright/test';

const lua = '--[=[\nA comment with "quotes"\n]=]\nlocal tune = [==[--not a comment]==]\nreturn print(tune, 0x20)';
const luau = '--!strict\nexport type Speed = number\nlocal v = 0b1010\n-- idle speed\nreturn `speed: {v + 1}`';

test('highlights editable Luau tokens as they change, with a highlighted read-only result', async ({ page }) => {
  await page.goto('/obfuscate');
  const editor = page.getByRole('textbox', { name: 'Source code' });
  await editor.fill(luau);
  await expect(editor.locator('.sx-directive')).toHaveText('--!strict');
  await expect(editor.locator('.sx-keyword')).toHaveText(['export', 'type', 'local', 'return']);
  await expect(editor.locator('.sx-type')).toHaveText('number');
  await expect(editor.locator('.sx-comment')).toHaveText('-- idle speed');
  await expect(editor.locator('.sx-literal')).toHaveText(['0b1010', '1']);
  await expect(editor.locator('.sx-string').first()).toContainText('speed:');
  const inks = await Promise.all(['.sx-keyword', '.sx-string', '.sx-literal', '.sx-comment'].map(s => editor.locator(s).first().evaluate(el => getComputedStyle(el).color)));
  expect(new Set(inks).size).toBe(4);
  await editor.fill('return '); await editor.press('End'); await page.keyboard.type('true');
  await expect(editor.locator('.sx-literal')).toHaveText('true');
  await editor.press('Control+Enter');
  const output = page.getByRole('textbox', { name: 'Build output', exact: true });
  await expect(output).toHaveAttribute('aria-readonly', 'true'); await expect(output).not.toBeEditable();
  await expect(output.locator('.sx-keyword')).toHaveText('return'); await expect(output.locator('.sx-literal')).toHaveText('true');
  await editor.press('Control+z'); await expect(output).toHaveCount(0);
  await editor.press('Control+y'); await expect(editor.locator('.sx-literal')).toHaveText('true');
  await editor.press('Tab'); await expect(page.getByRole('button', { name: 'Clear source' })).toBeFocused();
});

test('Lua long strings and comments keep their boundaries; highlighting never edits the source file', async ({ page, context }) => {
  await page.goto('/obfuscate', { waitUntil: 'networkidle' }); await context.setOffline(true);
  const raw = lua.replace(/\n/g, '\r\n') + '\r\n';
  await page.getByLabel('Open Lua or Luau source').setInputFiles({ name: 'قطعة.lua', mimeType: 'text/plain', buffer: Buffer.from(raw) });
  const editor = page.getByRole('textbox', { name: 'Source code' });
  await expect(editor.locator('.sx-comment')).toHaveText(['--[=[', 'A comment with "quotes"', ']=]']);
  await expect(editor.locator('.sx-string')).toHaveText('[==[--not a comment]==]');
  await expect(editor.locator('.sx-function')).toHaveText('print');
  await expect(editor.locator('.sx-literal')).toHaveText('0x20');
  for (const label of ['Encode text literals', 'Remove comments', 'Compact spacing']) await page.getByLabel(label).uncheck();
  await page.getByRole('button', { name: 'Build output' }).click();
  const waiting = page.waitForEvent('download'); await page.getByRole('link', { name: 'Download', exact: true }).click();
  const file = await waiting; expect(file.suggestedFilename()).toBe('قطعة.compact.lua');
  const chunks = []; for await (const chunk of (await file.createReadStream())!) chunks.push(chunk);
  expect(Buffer.concat(chunks)).toEqual(Buffer.from(raw));
});

test('edits keep CRLF on copy; reopening the same file starts a fresh undo history', async ({ page }) => {
  await page.goto('/obfuscate');
  const editor = page.getByRole('textbox', { name: 'Source code' }), picker = page.getByLabel('Open Lua or Luau source');
  const raw = '-- note\r\nreturn 1';
  const open = (text: string) => picker.setInputFiles({ name: 'test.lua', mimeType: 'text/plain', buffer: Buffer.from(text) });
  await open(raw); await expect(editor.locator('.sx-literal')).toHaveText('1');
  await editor.press('Control+End'); await editor.press('2');
  for (const name of ['Encode text literals', 'Remove comments', 'Compact spacing']) await page.getByRole('checkbox', { name }).uncheck();
  await editor.press('Control+Enter');
  // Capture the exact string sent to the Clipboard API before any OS-specific conversion.
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
    writeText: async (text: string) => { document.documentElement.dataset.copied = text; },
  } }));
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect(page.locator('html')).toHaveAttribute('data-copied', raw + '2');
  await open(raw + '2'); await expect(page.getByRole('link', { name: 'Download', exact: true })).toHaveCount(0);
  await editor.press('Control+z'); await expect(editor.locator('.sx-literal')).toHaveText('12');
  await page.getByRole('button', { name: 'Clear source' }).click(); await editor.press('Control+z');
  await expect(page.getByRole('region', { name: 'Source editor' })).toContainText('0 lines');
  await page.getByRole('button', { name: 'Load example source' }).click(); await expect(editor.locator('.sx-string')).toHaveText('"Orbit"');
});

for (const [width, height] of [[320, 640], [390, 844], [1440, 900]]) {
  test(`compact ordered panels and internal scrolling for a long file at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height }); await page.goto('/obfuscate');
    const input = page.getByRole('region', { name: 'Source editor' }), recipe = page.getByRole('region', { name: 'Build settings' });
    const artifact = page.getByRole('region', { name: 'Output file' });
    const paneHeight = async () => (await input.locator('.cm-editor').boundingBox())!.height;
    await expect(input.locator('.cm-editor')).toBeVisible();
    const before = await paneHeight(); expect(before).toBeLessThanOrEqual(width < 600 ? 120 : 145);
    expect((await artifact.boundingBox())!.height).toBeLessThan(100);
    expect(await page.getByRole('button', { name: 'Build output' }).evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(height);
    const boxes = await Promise.all([input, recipe, artifact].map(loc => loc.boundingBox()));
    const [a, b, c] = boxes.map(box => box!);
    if (width < 600) expect(b.y).toBeGreaterThan(a.y + a.height);
    else expect(b.x).toBeGreaterThan(a.x + a.width);
    expect(c.y).toBeGreaterThan(b.y + b.height);
    const source = 'local name = "' + 'a'.repeat(320) + '"\n' + 'local v = 0\n'.repeat(12000) + 'return "last row"';
    await page.getByLabel('Open Lua or Luau source').setInputFiles({ name: 'long.luau', mimeType: 'text/plain', buffer: Buffer.from(source) });
    await expect(input).toContainText('12002 lines'); expect(await paneHeight()).toBe(before);
    const scroller = input.locator('.cm-scroller');
    expect(await scroller.evaluate(el => el.scrollWidth > el.clientWidth && el.scrollHeight > el.clientHeight)).toBe(true);
    await scroller.evaluate(el => { el.scrollTop = el.scrollHeight; });
    await expect(input.locator('.sx-string').filter({ hasText: 'last row' })).toBeVisible();
    expect(await input.locator('.cm-line').count()).toBeLessThan(200);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  });
}

test('oversized edits are rejected before replacing a draft; clipboard fallback selects output', async ({ page }) => {
  await page.goto('/obfuscate');
  const editor = page.getByRole('textbox', { name: 'Source code' }); await editor.fill('return 16');
  // One paste that fits the character limit, but exceeds the UTF-8 byte limit.
  await editor.evaluate(el => { const data = new DataTransfer(); data.setData('text/plain', 'أ'.repeat(263000));
    el.dispatchEvent(new ClipboardEvent('paste', { clipboardData: data, bubbles: true, cancelable: true })); });
  await expect(page.getByRole('alert')).toContainText('512 KiB'); await expect(editor).toHaveText('return 16');
  await editor.press('Control+Enter'); await expect(page.getByRole('alert')).toHaveCount(0);
  await page.evaluate(() => Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Clipboard denied'); } } }));
  await page.getByRole('button', { name: 'Copy', exact: true }).click();
  await expect(page.getByRole('textbox', { name: 'Build output', exact: true })).toBeFocused();
  await expect.poll(() => page.evaluate(() => getSelection()?.toString())).toBe('return 16');
});
