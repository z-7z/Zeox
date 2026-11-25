import { expect, test, type Page } from './guest-workspace';
import { expectToolsAt, go } from './navigation';

for (const [width, height, edge] of [
  [320, 568, 'bottom'],
  [844, 390, 'bottom'],
  [1440, 900, 'left'],
  [2560, 1440, 'left'],
] as const) {
  test(`site uses the entire ${width}×${height} viewport without a fullscreen control`, async ({ page }) => {
    await page.setViewportSize({ width, height });
    await page.goto('/dashboard');
    for (const tool of ['Obfuscator', 'Encryption', 'Usages', 'Dashboard'] as const) {
      await go(page, tool);
      await expectToolsAt(page, edge);
      const brand = page.getByRole('link', { name: 'ZeoxFucator home' });
      await expect(brand).toHaveText('ZeoxFucator');
      await expect(page).toHaveTitle(/— ZeoxFucator$/);
      await expect(page.getByRole('button', { name: /full\s*screen/i })).toHaveCount(0);
      const fits = await page.evaluate(() => {
        const app = document.querySelector('.orbit-app')!.getBoundingClientRect(),
          header = document.querySelector('.topbar')!.getBoundingClientRect(),
          doc = document.documentElement;
        return (
          header.top === 0 &&
          header.left === 0 &&
          header.right === doc.clientWidth &&
          app.height >= innerHeight &&
          app.width === doc.clientWidth &&
          doc.scrollWidth === doc.clientWidth &&
          !document.fullscreenElement
        );
      });
      expect(fits).toBe(true);
    }
  });
}

async function fillPass(page: Page, value: string) {
  await page.getByLabel('Passphrase', { exact: true }).fill(value);
  await page.getByLabel('Confirm passphrase', { exact: true }).fill(value);
}

test('standalone encryption shows real phases and a pending-only skeleton, verifies and restores a neutrally named archive offline', async ({
  page,
  context,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/vault', { waitUntil: 'networkidle' });
  await expect(page).toHaveURL(/\/encrypt$/);
  await context.setOffline(true);
  const skeleton = page.getByRole('group', { name: 'Preparing download' }),
    progress = page.getByRole('progressbar', { name: 'Encryption progress' });
  await expect(skeleton).toHaveCount(0);
  await expect(progress).toHaveCount(0);
  await expect(page.locator('.ribbon')).toHaveCount(0);
  const [chooser] = await Promise.all([
    page.waitForEvent('filechooser'),
    page.getByRole('button', { name: 'Upload file' }).press('Enter'),
  ]);
  const original = Buffer.from('return "private sample"\r\n');
  await chooser.setFiles({ name: 'local.lua', mimeType: 'text/plain', buffer: original });
  await page.getByRole('button', { name: 'Generate passphrase' }).click();
  await page.getByRole('dialog').getByRole('button', { name: 'Generate & use' }).click();
  const pass = page.getByLabel('Passphrase', { exact: true });
  const secret = await pass.inputValue();
  expect(secret).toMatch(/^[A-Za-z0-9_-]{24}$/);
  const confirmation = page.getByLabel('Confirm passphrase', { exact: true });
  await expect(confirmation).toHaveValue('');
  await confirmation.fill(secret);
  await page.getByText('Archive options', { exact: true }).click();
  await page.getByRole('combobox', { name: 'Archive filename' }).click();
  await page.getByRole('option', { name: 'Use archive.zeox' }).click();
  const verify = page.getByRole('switch', { name: 'Verify archive' });
  await verify.check();
  // Hold actual Web Crypto calls. Nothing in the UI advances based on a timer.
  await page.evaluate(() => {
    const derive = SubtleCrypto.prototype.deriveKey,
      decrypt = SubtleCrypto.prototype.decrypt;
    SubtleCrypto.prototype.deriveKey = async function (...args) {
      await new Promise((r) => addEventListener('finish-kdf', r, { once: true }));
      return derive.apply(this, args);
    };
    SubtleCrypto.prototype.decrypt = async function (...args) {
      SubtleCrypto.prototype.decrypt = decrypt;
      await new Promise((r) => addEventListener('finish-check', r, { once: true }));
      return decrypt.apply(this, args);
    };
  });
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await expect(progress).toHaveAttribute('aria-valuetext', 'Deriving key · Step 2 of 5');
  await expect(progress).toBeInViewport();
  await expect(skeleton).toBeVisible();
  await expect(page.locator('a[download]')).toHaveCount(0);
  await expect(verify).toBeDisabled();
  await expect(pass).toHaveAttribute('type', 'password');
  expect(
    await skeleton
      .locator('i')
      .first()
      .evaluate((el) => getComputedStyle(el).animationName),
  ).toBe('none');
  await go(page, 'Usages');
  await go(page, 'Encryption');
  await expect(pass).toHaveValue('');
  await expect(skeleton).toBeVisible();
  await page.evaluate(() => dispatchEvent(new Event('finish-kdf')));
  await expect(progress).toHaveAttribute('aria-valuetext', 'Verifying archive · Step 4 of 5');
  await page.evaluate(() => dispatchEvent(new Event('finish-check')));
  const artifact = page.getByRole('link', { name: 'Download .zeox' });
  await expect(artifact).toHaveAttribute('download', 'archive.zeox');
  await expect(progress).toHaveCount(0);
  await expect(skeleton).toHaveCount(0);
  const [dl] = await Promise.all([page.waitForEvent('download'), artifact.click()]);
  const chunks = [];
  for await (const c of (await dl.createReadStream())!) chunks.push(c);
  const bytes = Buffer.concat(chunks);
  expect(bytes.subarray(0, 5)).toEqual(Buffer.from('ZEOX\x01'));
  expect(bytes.includes(Buffer.from('local.lua'))).toBe(false);
  await page.getByRole('radio', { name: 'Decrypt', exact: true }).check();
  await expect(verify).toHaveCount(0);
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'archive.zeox', mimeType: 'application/octet-stream', buffer: bytes });
  await pass.fill(secret);
  const run = page.getByRole('button', { name: 'Decrypt file', exact: true });
  await run.click();
  await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuetext', /Deriving key/);
  await page.evaluate(() => dispatchEvent(new Event('finish-kdf')));
  const restored = page.getByRole('link', { name: 'Download original', exact: true });
  await expect(restored).toHaveAttribute('download', 'local.lua');
  const [out] = await Promise.all([page.waitForEvent('download'), restored.click()]);
  const parts = [];
  for await (const c of (await out.createReadStream())!) parts.push(c);
  expect(Buffer.concat(parts)).toEqual(original);
  await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('2');
  await expect(page.getByRole('table')).not.toContainText('local.lua');
});

test('failed verification clears pending UI, cannot be downloaded, and can be retried', async ({ page }) => {
  await page.goto('/encrypt');
  await page.getByRole('button', { name: 'Use sample' }).click();
  await fillPass(page, 'a private testing passphrase');
  await page.getByText('Archive options', { exact: true }).click();
  await page.getByRole('switch', { name: 'Verify archive' }).check();
  await page.evaluate(() => {
    const decrypt = SubtleCrypto.prototype.decrypt;
    SubtleCrypto.prototype.decrypt = async function () {
      SubtleCrypto.prototype.decrypt = decrypt;
      throw new Error('test verification failure');
    };
  });
  const run = page.getByRole('button', { name: 'Encrypt file', exact: true });
  await run.click();
  await expect(page.getByRole('alert')).toContainText('Archive verification failed');
  await expect(page.getByRole('heading', { name: 'No download created' })).toBeVisible();
  await expect(page.locator('a[download], .download-skeleton, [role=progressbar]')).toHaveCount(0);
  await expect(run).toBeEnabled();
  await run.click();
  await expect(page.getByRole('link', { name: 'Download .zeox' })).toBeFocused();
  await expect(page.getByRole('alert')).toHaveCount(0);
  await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('1');
});
