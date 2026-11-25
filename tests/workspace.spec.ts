import { expect, test, type Download } from '@playwright/test';

import { attach, downloadOutput } from './attachments';
import { destinations, expectToolsAt, go, toolNav } from './navigation';

async function text(download: Download) {
  const stream = await download.createReadStream(); if (!stream) throw new Error('Missing file');
  const chunks = []; for await (const chunk of stream) chunks.push(chunk); return Buffer.concat(chunks).toString('utf8');
}

for (const width of [320, 1440]) {
  test(`responsive tool routes and browser history at ${width}px`, async ({ page }) => {
    await page.setViewportSize({width,height:844}); await page.goto('/');
    await expect(page.getByRole('heading', {level:1,name:'Lua Obfuscator'})).toBeVisible();
    for (const {label, path, heading} of destinations) {
      await go(page, label); await expect(page).toHaveURL(new RegExp(path+'$'));
      await expect(page.getByRole('heading', {level:1,name:heading,exact:true})).toBeVisible();
      await expect(toolNav(page).locator('[aria-current=page]')).toHaveText(label);
      await expectToolsAt(page, width === 320 ? 'bottom' : 'left');
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    await page.goBack(); await expect(page).toHaveTitle('Usages — ZeoxFucator');
    await page.goForward(); await expect(page).toHaveTitle('Dashboard — ZeoxFucator');
    for (const path of ['/dashboard/overview', '/showcase']) {
      await page.goto(path); await expect(page).toHaveURL(/\/dashboard$/); await expect(page.getByLabel('Sample period')).toBeVisible();
    }
  });
}

test('local source file builds offline, downloads under a distinct name, and survives section changes', async ({ page, context }) => {
  const original = '--!strict\n-- scratch\nlocal  msg = [=[  -- ملف\ntext  ]=]\nreturn    msg\n';
  const expected = '--!strict\nlocal msg = [=[  -- ملف\ntext  ]=]\nreturn msg\n';
  await page.goto('/obfuscate', { waitUntil: 'networkidle' }); await context.setOffline(true);
  await attach(page, 'ملف.lua', original); await expect(page.getByRole('group', { name: 'Source file' })).toContainText('ملف.lua');
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  const file = await downloadOutput(page); expect(file.name).toBe('ملف.obf.lua'); expect(file.bytes.toString()).toBe(expected);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await context.setOffline(false); await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' })).toContainText('1');
  await expect(page.getByRole('table').getByRole('row').nth(1)).toContainText('Source build');
  await expect(page.getByRole('table')).not.toContainText('ملف');
  await go(page, 'Obfuscator'); await expect(page.getByRole('status')).toContainText('ملف.obf.lua');
  for (const name of ['Encode text literals', 'Remove comments', 'Compact spacing']) await page.getByRole('switch', { name }).uncheck();
  await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  expect(await downloadOutput(page)).toEqual({ name: 'ملف.compact.lua', bytes: Buffer.from(original) });
});

test('usage counts successes only, filters and exports metadata, resets without losing a Vault download', async ({ page }) => {
  await page.goto('/obfuscate');
  await attach(page); await page.getByRole('button', { name: 'Obfuscate file' }).click(); await go(page, 'Encryption');
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click(); await expect(page.getByRole('alert')).toContainText('Choose a file first');
  await page.getByRole('button', { name: 'Use sample' }).click();
  const pass = page.getByLabel('Passphrase', { exact: true }), secret = 'not stored in the ledger'; await pass.fill(secret);
  await go(page, 'Usages'); await go(page, 'Encryption'); await expect(pass).toHaveValue('');
  await pass.fill(secret); await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret);
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  // Navigation need not wait for the in-flight job.
  await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('2');
  const filter = page.getByLabel('Filter usage log'); await filter.click(); await page.getByRole('option',{name:'Encryption',exact:true}).click();
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(2);
  const waiting = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export log' }).click();
  const csv = await text(await waiting); expect(csv).toMatch(/Z,Encryption,\d+,\d+\r\n$/); expect(csv).not.toMatch(/game-config|Source build|not stored/);
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('2');
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Clear usage' }).click();
  await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page, 'Encryption'); await expect(page.getByRole('link', { name: 'Download .zeox' })).toBeVisible();
  await page.reload(); await expect(page.getByRole('link', { name: 'Download .zeox' })).toHaveCount(0);
});

test('invalid attachments preserve a good file and failed builds do not count', async ({ page }) => {
  await page.goto('/obfuscate'); await attach(page, 'good.luau');
  const intake = page.getByRole('group', { name: 'Source file' }); await expect(intake).toContainText('good.luau');
  for (const [name, buffer, message] of [
    ['place.rbxl', Buffer.alloc(1), 'Choose a .lua or .luau'], ['bad.lua', Buffer.from([255]), 'UTF-8'],
    ['binary.luau', Buffer.from([0]), 'not a text script'], ['huge.lua', Buffer.alloc(512 * 1024 + 1), '512 KiB'],
    ['empty.luau', Buffer.from('  \r\n'), 'empty'],
  ] as const) {
    await attach(page, name, buffer); await expect(page.getByRole('alert')).toContainText(message);
    await expect(intake).toContainText('good.luau'); await expect(page.getByRole('alert')).toContainText('previous file is still attached');
  }
  await attach(page, 'unfinished.lua', 'return [=[unfinished'); await page.getByRole('button', { name: 'Obfuscate file' }).click();
  await expect(page.getByRole('alert')).toContainText('no closing bracket'); await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
  await go(page, 'Usages'); await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page, 'Obfuscator'); await expect(intake).toContainText('unfinished.lua');
});
