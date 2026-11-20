import { expect, test } from '@playwright/test';
import { attach, downloadOutput } from './attachments';
import { go } from './navigation';

const noCodePane = 'textarea, [contenteditable="true"], [role="textbox"], pre, .cm-editor';

test('empty intake → native keyboard chooser → local build → downloadable file, never an editor', async ({ page, context }) => {
  await page.goto('/obfuscate', { waitUntil: 'networkidle' }); await context.setOffline(true);
  const build = page.getByRole('button', { name: 'Obfuscate file' }), choose = page.getByRole('button', { name: 'Choose file' });
  const stage = page.getByRole('list', { name: 'File workflow' }).locator('[aria-current=step]');
  await expect(stage).toContainText('Attach'); await expect(build).toBeDisabled();
  await expect(page.locator(noCodePane)).toHaveCount(0); await expect(page.getByRole('button', { name: /example|sample/i })).toHaveCount(0);
  await expect(page.locator('input[type=file]')).toHaveAttribute('accept', '.lua,.luau'); await expect(page.getByRole('checkbox')).toHaveCount(0);
  await choose.focus(); const [picker] = await Promise.all([page.waitForEvent('filechooser'), choose.press('Enter')]);
  expect(picker.isMultiple()).toBe(false);
  const input = '--!strict\r\n-- note\r\nreturn "hi"\r\n', output = '--!strict\nreturn "\\104\\105"\n';
  await picker.setFiles({ name: 'reward.LUAU', mimeType: '', buffer: Buffer.from(input) });
  await expect(stage).toContainText('Build'); await expect(page.getByRole('group', { name: 'Source file' })).toContainText('reward.LUAU');
  await build.click(); await expect(stage).toContainText('Save');
  await expect(page.getByRole('link', { name: 'Download file' })).toBeFocused();
  expect(await downloadOutput(page)).toEqual({ name: 'reward.obf.LUAU', bytes: Buffer.from(output) });
  await expect(page.locator(noCodePane)).toHaveCount(0); await expect(page.locator('main')).not.toContainText('return "hi"'); await expect(page.locator('main')).not.toContainText('\\104\\105');
  // Dismissing the picker isn't a new attachment. Actually opening even the same file is.
  await page.locator('input[type=file]').setInputFiles([]); await expect(page.getByRole('link', { name: 'Download file' })).toBeVisible();
  await attach(page, 'reward.LUAU', input); await expect(build).toBeEnabled(); await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Remove file' }).click(); await expect(choose).toBeFocused(); await expect(build).toBeDisabled();
});

test('file drops share the same validation; multiple files and plain text are not source inputs', async ({ page }) => {
  await page.goto('/obfuscate'); const zone = page.getByRole('group', { name: 'Source file' });
  const transfer = (names: string[]) => page.evaluateHandle(names => {
    const data = new DataTransfer();
    if (!names.length) data.setData('text/plain', 'print("not a file")');
    for (const name of names) data.items.add(new File(['return 16'], name));
    return data;
  }, names);
  const drop = async (names: string[]) => {
    const dataTransfer = await transfer(names); await zone.dispatchEvent('dragenter', { dataTransfer });
    if (names.length) await expect(zone).toContainText('Drop to attach');
    await zone.dispatchEvent('drop', { dataTransfer }); await dataTransfer.dispose();
  };
  const build = page.getByRole('button', { name: 'Obfuscate file' }); await drop([]); await expect(build).toBeDisabled();
  await drop(['one.luau', 'two.lua']); await expect(page.getByRole('alert')).toContainText('one script at a time'); await expect(build).toBeDisabled();
  await drop(['intro\u202e.LuA']); await expect(zone).toContainText('intro_.LuA'); await expect(page.getByRole('alert')).toHaveCount(0);
  await build.click(); expect(await downloadOutput(page)).toEqual({ name: 'intro_.obf.LuA', bytes: Buffer.from('return 16') });
  await drop(['not-a-script.txt']); await expect(zone).toContainText('intro_.LuA'); await expect(page.getByRole('alert')).toContainText('previous file is still attached');
  await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
  await page.reload(); await expect(build).toBeDisabled(); await expect(page.getByRole('alert')).toHaveCount(0);
});

test('turning off transformations preserves a 512 KiB attachment byte-for-byte, including BOM and CRLF', async ({ page, context }) => {
  const input = Buffer.alloc(512 * 1024, 32); Buffer.from('\ufeff-- header\r\nlocal  a = "ملف"\r\nreturn  a\r\n').copy(input);
  await page.goto('/obfuscate', { waitUntil: 'networkidle' }); await context.setOffline(true);
  await attach(page, 'قطعة.lua', input); await page.locator('summary').focus(); await page.keyboard.press('Space');
  for (const label of ['Encode text literals', 'Remove comments', 'Compact spacing']) await page.getByRole('checkbox', { name: label }).uncheck();
  await expect(page.locator('summary')).toContainText('0 enabled'); await page.getByRole('button', { name: 'Obfuscate file' }).click();
  const output = await downloadOutput(page); expect(output.name).toBe('قطعة.compact.lua'); expect(output.bytes.equals(input)).toBe(true);
  await page.getByRole('checkbox', { name: 'Encode text literals' }).check(); await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Obfuscate file' })).toBeEnabled();
});

test('a slow read cannot overwrite a replacement or resurrect a removed attachment', async ({ page }) => {
  await page.goto('/obfuscate'); await page.evaluate(() => {
    const read = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = async function () {
      const bytes = await read.call(this);
      if (this.name.startsWith('slow-')) {
        await new Promise<void>(resolve => {
          window.addEventListener('resume-read', () => resolve(), { once: true }); document.body.dataset.readHeld = this.name;
        });
        delete document.body.dataset.readHeld;
      }
      return bytes;
    };
  });
  const zone = page.getByRole('group', { name: 'Source file' }), build = page.getByRole('button', { name: 'Obfuscate file' });
  async function hold(name: string) { await attach(page, name); await expect(page.locator('body')).toHaveAttribute('data-read-held', name); await expect(zone).toHaveAttribute('aria-busy', 'true'); await expect(build).toBeDisabled(); }
  async function resume() { await page.evaluate(() => window.dispatchEvent(new Event('resume-read'))); await expect(page.locator('body')).not.toHaveAttribute('data-read-held'); }
  await hold('slow-first.lua'); await go(page, 'Usages'); await go(page, 'Obfuscate'); await expect(build).toBeDisabled();
  await attach(page, 'latest.lua', 'return 2'); await expect(zone).toContainText('latest.lua'); await resume();
  await build.click(); expect(await downloadOutput(page)).toEqual({ name: 'latest.obf.lua', bytes: Buffer.from('return 2') });
  await hold('slow-next.luau'); await page.getByRole('button', { name: 'Remove file' }).click(); await resume();
  await expect(page.getByRole('button', { name: 'Choose file' })).toBeVisible(); await expect(build).toBeDisabled(); await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
});

for (const [width, height] of [[320, 568], [390, 844], [568, 320], [844, 390], [1440, 900]]) {
  test(`single upload surface and both primary actions fit at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({ width, height }); await page.goto('/obfuscate');
    const build = page.getByRole('button', { name: 'Obfuscate file' });
    for (const button of [page.getByRole('button', { name: 'Choose file' }), build]) expect(await button.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(height);
    const name = 'a'.repeat(180) + '.luau'; await attach(page, name); await expect(build).toBeEnabled();
    await expect(page.getByRole('group', { name: 'Source file' })).toContainText(name); await build.click();
    await expect(page.getByRole('link', { name: 'Download file' })).toBeInViewport();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator('main section.glass-card')).toHaveCount(1); await expect(page.locator(noCodePane)).toHaveCount(0);
  });
}
