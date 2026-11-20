import { test, expect, type Download, type Page } from '@playwright/test';
import { createDecipheriv, pbkdf2Sync } from 'node:crypto';
import { openSidebar } from './navigation';

const secret = 'orbit atlas lantern violet';
async function read(download: Download) {
  const stream = await download.createReadStream();
  if (!stream) throw new Error('Missing download');
  const buffers: Buffer[] = [];
  for await (const part of stream) buffers.push(part);
  return Buffer.concat(buffers);
}
async function getDownload(page: Page, label: string) {
  const waiting = page.waitForEvent('download');
  await page.getByRole('link', { name: label, exact: true }).click();
  const file = await waiting;
  return { name: file.suggestedFilename(), bytes: await read(file) };
}
async function loadFile(page: Page, name: string, contents: Buffer) {
  await page.locator('input[type=file]').setInputFiles({ name, mimeType: 'application/octet-stream', buffer: contents });
}
async function fillSecret(page: Page, encrypt: boolean, value = secret) {
  await page.getByLabel('Passphrase', { exact: true }).fill(value);
  if (encrypt) await page.getByLabel('Confirm passphrase', { exact: true }).fill(value);
}
async function useSample(page: Page) {
  await page.getByRole('button', { name: 'Use sample' }).click();
  await fillSecret(page, true);
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  return getDownload(page, 'Download .zeox');
}

for (const suffix of ['luau', 'lua', 'rbxl', 'rbxlx', 'rbxm', 'rbxmx']) {
  test(`encrypts and restores a .${suffix} file byte-for-byte while offline`, async ({ page, context }) => {
    await page.goto('/vault', { waitUntil: 'networkidle' });
    await context.setOffline(true);
    const name = `ملف-game.${suffix}`;
    const bytes = suffix.startsWith('rb') ? Buffer.from([0, 255, 128, 13, 10, 12, 42, 69, 0]) : Buffer.from('-- نص\r\nreturn { name = "Orbit" }\r\n');
    await loadFile(page, name, bytes);
    await fillSecret(page, true);
    await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
    const archive = await getDownload(page, 'Download .zeox');
    expect(archive.name).toBe(name + '.zeox');
    expect(archive.bytes.subarray(0, 5)).toEqual(Buffer.from([90, 69, 79, 88, 1]));
    expect(archive.bytes.includes(Buffer.from(secret))).toBe(false);
    // Verify the versioned wire format independently of the browser decryptor.
    const header = archive.bytes.subarray(0, 33);
    const key = pbkdf2Sync(secret, header.subarray(5, 21), 600_000, 32, 'sha256');
    const cipher = createDecipheriv('aes-256-gcm', key, header.subarray(21));
    cipher.setAAD(header); cipher.setAuthTag(archive.bytes.subarray(-16));
    const plain = Buffer.concat([cipher.update(archive.bytes.subarray(33, -16)), cipher.final()]);
    const length = plain.readUInt16BE(0);
    expect(plain.subarray(2, length + 2).toString('utf8')).toBe(name);
    expect(plain.subarray(length + 2)).toEqual(bytes);
    await page.getByRole('button', { name: 'Decrypt', exact: true }).click();
    await loadFile(page, 'renamed.zeox', archive.bytes);
    await fillSecret(page, false);
    await page.getByRole('button', { name: 'Decrypt file', exact: true }).click();
    const restored = await getDownload(page, 'Download original');
    expect(restored.name).toBe(name);
    expect(restored.bytes).toEqual(bytes);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  });
}

test('fresh salts and nonces; rejects wrong passphrases and changed archives', async ({ page }) => {
  await page.goto('/vault');
  const first = await useSample(page);
  await page.getByRole('button', { name: 'Process another file' }).click();
  const second = await useSample(page);
  expect(first.bytes.subarray(5, 21)).not.toEqual(second.bytes.subarray(5, 21));
  expect(first.bytes.subarray(21, 33)).not.toEqual(second.bytes.subarray(21, 33));
  await page.getByRole('button', { name: 'Decrypt', exact: true }).click();
  await loadFile(page, first.name, first.bytes);
  await fillSecret(page, false, 'not the same password');
  await page.getByRole('button', { name: 'Decrypt file', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Could not unlock');
  const changed = Buffer.from(first.bytes); changed[changed.length - 1] ^= 1;
  await loadFile(page, first.name, changed);
  await fillSecret(page, false);
  await page.getByRole('button', { name: 'Decrypt file', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Could not unlock');
  await expect(page.getByRole('link', { name: 'Download original' })).toHaveCount(0);
  await loadFile(page, 'invalid.zeox', Buffer.alloc(128));
  await page.getByRole('button', { name: 'Decrypt file', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Unrecognized archive');
});

test('reports unsupported, oversized, missing and mismatched inputs without overwriting files', async ({ page }) => {
  await page.goto('/vault');
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Browse files' })).toBeFocused();
  await loadFile(page, 'test.txt', Buffer.from('not supported'));
  await expect(page.getByRole('alert')).toContainText('Choose a .luau');
  // Use a browser File in a drag event; do not send a 25 MB fixture over the wire.
  await page.locator('.vt-drop').evaluate(el => {
    const dt = new DataTransfer(); dt.items.add(new File([new Uint8Array(25_000_001)], 'large.rbxl'));
    el.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer: dt }));
  });
  await expect(page.getByRole('alert')).toContainText('too large');
  await page.getByRole('button', { name: 'Use sample' }).click();
  await fillSecret(page, true, 'short');
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('at least 12');
  await page.getByLabel('Passphrase', { exact: true }).fill(secret);
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('same passphrase');
  await expect(page.getByLabel('Confirm passphrase', { exact: true })).toBeFocused();
  await page.getByRole('button', { name: 'Remove selected file' }).click();
  await expect(page.getByRole('button', { name: 'Browse files' })).toBeVisible();
});

test('session log is metadata only, clearable and transient', async ({ page }) => {
  await page.goto('/vault');
  await useSample(page);
  await page.getByRole('button', { name: 'Open session log' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toContainText('game-config.luau');
  await expect(dialog).not.toContainText(secret);
  await dialog.getByRole('button', { name: 'Clear session log' }).click();
  await expect(dialog).toContainText('No files processed yet');
  await page.keyboard.press('Escape');
  await page.reload();
  await expect(page.getByLabel('Passphrase', { exact: true })).toHaveValue('');
  await expect(page.getByRole('link', { name: 'Download .zeox' })).toHaveCount(0);
  await expect(page.getByRole('region', { name: 'Session activity' })).toContainText('No files processed yet');
});

test('the expanded file surface and responsive step layout preserve an in-progress job', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 }); await page.goto('/vault');
  const browse = page.getByRole('button', { name: 'Browse files' }), width = (await browse.boundingBox())!.width;
  const [picker] = await Promise.all([page.waitForEvent('filechooser'), browse.click({ position: { x: Math.floor(width) - 6, y: 15 } })]);
  const name = 'مشهد-workbench.rbxl';
  await picker.setFiles({ name, mimeType: 'application/octet-stream', buffer: Buffer.from([0,255,13,10]) });
  await fillSecret(page, true);
  const replace = page.getByRole('button', { name: 'Replace selected file' });
  await page.getByRole('button', { name: 'Hide sidebar' }).click(); expect((await replace.boundingBox())!.width).toBeGreaterThan(width + 40);
  await page.setViewportSize({ width: 844, height: 390 });
  const file = (await page.locator('.vt-file-step').boundingBox())!, key = (await page.locator('.vt-key-step').boundingBox())!;
  expect(key.y).toBe(file.y); expect(key.x).toBeGreaterThan(file.x + file.width);
  await expect(replace).toContainText(name); await expect(page.getByLabel('Passphrase', { exact: true })).toHaveValue(secret);
  const submit = page.getByRole('button', { name: 'Encrypt file', exact: true });
  expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(390);
  await submit.click(); await expect(page.getByRole('link', { name: 'Download .zeox' })).toHaveAttribute('download', name + '.zeox');
});

test('mobile studio fits the viewport, guide restores focus, and motion can be disabled', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/vault');
  await expect(page.getByRole('heading', { name: 'Vault', level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  expect((await page.getByRole('button', { name: 'Encrypt file', exact: true }).boundingBox())!.y).toBeLessThan(805);
  const guide = page.getByRole('button', { name: 'Open studio guide' });
  await guide.click();
  await expect(page.getByRole('dialog')).toContainText('must be decrypted');
  await page.keyboard.press('Escape'); await expect(guide).toBeFocused();
  await openSidebar(page); await page.getByRole('button', { name: 'Enable animation' }).click(); await page.keyboard.press('Escape');
  const art = page.locator('.vt-file-art img');
  expect(await art.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await page.emulateMedia({ reducedMotion: 'reduce' }); await page.reload();
  expect(await art.evaluate(el => getComputedStyle(el).animationName)).toBe('none');
  await openSidebar(page); await expect(page.getByRole('button', { name: 'Motion reduced by system preference' })).toBeDisabled();
});
