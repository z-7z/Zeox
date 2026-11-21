import { expect, test, type Download } from '@playwright/test';

import { attach, downloadOutput } from './attachments';
import { go, openSidebar, sidebar } from './navigation';

async function text(download: Download) {
  const stream = await download.createReadStream(); if (!stream) throw new Error('Missing file');
  const chunks = []; for await (const chunk of stream) chunks.push(chunk); return Buffer.concat(chunks).toString('utf8');
}

for (const width of [320, 390, 1440]) {
  test(`four vertical destinations, direct entries and history at ${width}px`, async ({ page }) => {
    const mobile = width < 761;
    await page.setViewportSize({ width, height: 844 }); await page.goto('/');
    await expect(page.getByRole('heading', { level: 1, name: 'Overview' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('navigation')).toHaveCount(0);
    if (mobile) await expect(sidebar(page)).toHaveCount(0);
    await page.keyboard.press('/'); await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/campaign|purchase rate|orders|sales|workspace commands/i);
    for (const section of ['Dashboard', 'Obfuscate', 'Usages', 'Vault']) {
      const nav = await openSidebar(page), links = nav.getByRole('link');
      expect(await links.evaluateAll(els => els.map(el => el.getAttribute('aria-label')))).toEqual(['Dashboard', 'Obfuscate', 'Usages', 'Vault']);
      await expect(links).toHaveText(['','','','']);
      const boxes = await links.evaluateAll(es => es.map(el => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.bottom]; }));
      expect(boxes[0][0]).toBeLessThan(width * .1);
      for (let i=1; i<boxes.length; i++) { expect(boxes[i][0]).toBeCloseTo(boxes[0][0]); expect(boxes[i][1]).toBeGreaterThanOrEqual(boxes[i-1][2]); }
      await nav.getByRole('link', { name: section, exact: true }).click(); await expect(page).toHaveURL(new RegExp('/'+section.toLowerCase()+'$'));
      await expect(page.getByRole('heading', { level: 1, name: section === 'Dashboard' ? 'Overview' : section, exact: true })).toBeVisible();
      if (mobile) await expect(sidebar(page)).toHaveCount(0); else await expect(nav.locator('[aria-current=page]')).toHaveAccessibleName(section);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    }
    if (mobile) await openSidebar(page);
    await page.goBack(); await expect(page).toHaveTitle('Usages — Zeox Workspace'); await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.goForward(); await expect(page).toHaveTitle('Vault — Zeox Workspace');
    await page.reload(); await expect(page.getByRole('button', { name: 'Use sample' })).toBeVisible();
    for (const path of ['/dashboard/overview', '/showcase']) {
      await page.goto(path); await expect(page).toHaveURL(/\/dashboard$/); await expect(page.getByText('No runs yet')).toBeVisible();
    }
  });
}

test('interface motion remains optional; the report and loading surfaces never shine', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  await expect(page.locator('.signal-main')).toHaveCSS('backdrop-filter', 'none'); await expect(page.locator('.signal-line')).toHaveCSS('animation-name', 'none');
  await openSidebar(page); const toggle = page.getByRole('button', { name: 'Enable animation' });
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-pressed', 'false'); await expect(page.locator('.db-scene')).toHaveAttribute('data-motion', 'off');
  await go(page, 'Vault'); await expect(page.locator('.cartridge-archive')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' }); await go(page, 'Dashboard'); await openSidebar(page);
  await expect(page.getByRole('button', { name: 'Motion reduced by system preference' })).toBeDisabled();
  await page.keyboard.press('Escape'); await expect(page.locator('.mix-index')).toHaveCSS('background-image', 'none');
});

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
  await go(page, 'Obfuscate'); await expect(page.getByRole('status')).toContainText('ملف.obf.lua');
  await page.locator('summary').click();
  for (const name of ['Encode text literals', 'Remove comments', 'Compact spacing']) await page.getByRole('checkbox', { name }).uncheck();
  await expect(page.getByRole('link', { name: 'Download file' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  expect(await downloadOutput(page)).toEqual({ name: 'ملف.compact.lua', bytes: Buffer.from(original) });
});

test('usage counts successes only, filters and exports metadata, resets without losing a Vault download', async ({ page }) => {
  await page.goto('/obfuscate');
  await attach(page); await page.getByRole('button', { name: 'Obfuscate file' }).click(); await go(page, 'Vault');
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click(); await expect(page.getByRole('alert')).toContainText('Choose a file first');
  await page.getByRole('button', { name: 'Use sample' }).click();
  const pass = page.getByLabel('Passphrase', { exact: true }), secret = 'not stored in the ledger'; await pass.fill(secret);
  await go(page, 'Usages'); await go(page, 'Vault'); await expect(pass).toHaveValue('');
  await pass.fill(secret); await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret);
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  // Navigation need not wait for the in-flight job.
  await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('2');
  await expect(page.getByRole('img',{name:/Input and output sizes for the last 2 runs/})).toBeVisible();
  await expect(page.locator('.run-chart rect')).toHaveCount(4);
  const filter = page.getByLabel('Filter usage log'); await filter.selectOption('vault');
  await expect(page.getByRole('table').getByRole('row')).toHaveCount(2);
  const waiting = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export log' }).click();
  const csv = await text(await waiting); expect(csv).toMatch(/Z,Encryption,\d+,\d+\r\n$/); expect(csv).not.toMatch(/game-config|Source build|not stored/);
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Cancel' }).click();
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('2');
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Clear usage' }).click();
  await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page, 'Vault'); await expect(page.getByRole('link', { name: 'Download .zeox' })).toBeVisible();
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
  await go(page, 'Obfuscate'); await expect(intake).toContainText('unfinished.lua');
});


test('toolbar search opens real tools and the session chip explains local state', async ({page}) => {
  await page.goto('/dashboard'); const find=page.getByRole('button',{name:'Find a tool'});
  await find.focus(); await page.keyboard.press('Control+k'); const search=page.getByRole('searchbox',{name:'Search tools'});
  await expect(search).toBeFocused(); await search.fill('unmatched'); await expect(page.getByRole('dialog',{name:'Find a tool'}).getByRole('status')).toContainText('No matching tool');
  await search.press('Escape'); await expect(find).toBeFocused(); await find.click(); await search.fill('restore'); await search.press('Enter');
  await expect(page).toHaveURL(/\/vault$/); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('button',{name:'Local session information'}).click(); await expect(page.getByRole('dialog')).toContainText('Tab memory');
  await page.keyboard.press('Escape'); await expect(page.getByRole('button',{name:'Local session information'})).toBeFocused();
  await page.getByRole('button',{name:'Keyboard shortcuts'}).click(); await expect(page.getByRole('dialog')).toContainText('Inspect a focused chart');
  await page.goBack(); await expect(page).toHaveURL(/\/dashboard$/); await expect(page.getByRole('dialog')).toHaveCount(0);
});
