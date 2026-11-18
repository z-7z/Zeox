import { expect, test, type Download, type Locator } from '@playwright/test';

import { go, openSidebar, sidebar } from './navigation';

// Read the rendered lines of these small fixtures exactly, including their
// trailing empty line. A contenteditable code view has no textarea.value.
const codeText = (editor: Locator) => editor.locator('.cm-line').allTextContents().then(lines => lines.join('\n'));
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
    await page.keyboard.press('/'); await page.keyboard.press('Control+k'); await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(/campaign|purchase rate|orders|sales|workspace commands/i);
    for (const section of ['Dashboard', 'Obfuscate', 'Usages', 'Vault']) {
      const nav = await openSidebar(page), links = nav.getByRole('link');
      await expect(links).toHaveText(['Dashboard', 'Obfuscate', 'Usages', 'Vault']);
      const boxes = await links.evaluateAll(es => es.map(el => { const b = el.getBoundingClientRect(); return [b.left, b.top, b.bottom]; }));
      expect(boxes[0][0]).toBeLessThan(width * .1);
      for (let i=1; i<boxes.length; i++) { expect(boxes[i][0]).toBeCloseTo(boxes[0][0]); expect(boxes[i][1]).toBeGreaterThanOrEqual(boxes[i-1][2]); }
      await nav.getByRole('link', { name: section, exact: true }).click(); await expect(page).toHaveURL(new RegExp('/'+section.toLowerCase()+'$'));
      await expect(page.getByRole('heading', { level: 1, name: section === 'Dashboard' ? 'Overview' : section, exact: true })).toBeVisible();
      if (mobile) await expect(sidebar(page)).toHaveCount(0); else await expect(nav.locator('[aria-current=page]')).toHaveText(section);
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

test('glass artwork moves inside stable cards, pauses offscreen and respects both motion switches', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/');
  const card = page.getByRole('region', { name: 'Export rate' }), art = card.locator('.ribbon-surface').first();
  await expect(card).toHaveCSS('backdrop-filter', 'blur(16px)'); await expect(art).toHaveCSS('animation-name', 'ribbon-breathe');
  await expect(card.locator('.ribbon-sheen')).toHaveCSS('animation-name', 'ribbon-scan');
  await expect(page.locator('.pie-drift')).toHaveCSS('animation-name', 'pie-drift');
  const bounds = await card.boundingBox(), transform = await art.evaluate(el => getComputedStyle(el).transform);
  await expect.poll(() => art.evaluate(el => getComputedStyle(el).transform)).not.toBe(transform); expect(await card.boundingBox()).toEqual(bounds);
  await page.setViewportSize({ width: 390, height: 260 }); await page.getByRole('button', { name: 'Download skeleton' }).scrollIntoViewIfNeeded();
  await expect(art).toHaveCSS('animation-play-state', 'paused');
  await openSidebar(page); const toggle = page.getByRole('button', { name: 'Enable animation' });
  await toggle.click(); await expect(toggle).toHaveAttribute('aria-pressed', 'false'); await expect(art).toHaveCSS('animation-name', 'none');
  await go(page, 'Vault'); await expect(page.locator('.vt-file-art img')).toHaveCSS('animation-name', 'none');
  await page.emulateMedia({ reducedMotion: 'reduce' }); await go(page, 'Dashboard'); await openSidebar(page);
  await expect(page.getByRole('button', { name: 'Motion reduced by system preference' })).toBeDisabled();
  await page.keyboard.press('Escape'); await expect(art).toHaveCSS('animation-name', 'none');
});

test('local source file builds offline, downloads under a distinct name, and survives section changes', async ({ page, context }) => {
  const original = '--!strict\n-- scratch\nlocal  msg = [=[  -- ملف\ntext  ]=]\nreturn    msg\n';
  const expected = '--!strict\nlocal msg = [=[  -- ملف\ntext  ]=]\nreturn msg\n';
  await page.goto('/obfuscate', { waitUntil: 'networkidle' }); await context.setOffline(true);
  await page.getByLabel('Open Lua or Luau source').setInputFiles({ name: 'ملف.lua', mimeType: 'text/plain', buffer: Buffer.from(original) });
  await expect.poll(() => codeText(page.getByLabel('Source code'))).toBe(original);
  await page.getByRole('button', { name: 'Build output' }).click();
  await expect.poll(() => codeText(page.getByLabel('Build output', { exact: true }))).toBe(expected);
  const waiting = page.waitForEvent('download'); await page.getByRole('link', { name: 'Download', exact: true }).click();
  const file = await waiting; expect(file.suggestedFilename()).toBe('ملف.obf.lua'); expect(await text(file)).toBe(expected);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await context.setOffline(false); await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' })).toContainText('1');
  await expect(page.getByRole('table').getByRole('row').nth(1)).toContainText('Source build');
  await expect(page.getByRole('table')).not.toContainText('ملف');
  await go(page, 'Obfuscate'); await expect.poll(() => codeText(page.getByLabel('Build output', { exact: true }))).toBe(expected);
  await page.getByLabel('Encode text literals').uncheck();
  await page.getByLabel('Remove comments').uncheck(); await page.getByLabel('Compact spacing').uncheck();
  await expect(page.getByRole('link', { name: 'Download', exact: true })).toHaveCount(0);
  await page.getByLabel('Source code').press('Control+Enter');
  await expect.poll(() => codeText(page.getByLabel('Build output', { exact: true }))).toBe(original);
});

test('usage counts successes only, filters and exports metadata, resets without losing a Vault download', async ({ page }) => {
  await page.goto('/obfuscate');
  await page.getByRole('button', { name: 'Build output' }).click(); await go(page, 'Vault');
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click(); await expect(page.getByRole('alert')).toContainText('Choose a file first');
  await page.getByRole('button', { name: 'Use sample' }).click();
  const pass = page.getByLabel('Passphrase', { exact: true }), secret = 'not stored in the ledger'; await pass.fill(secret);
  await go(page, 'Usages'); await go(page, 'Vault'); await expect(pass).toHaveValue('');
  await pass.fill(secret); await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret);
  await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  // Navigation need not wait for the in-flight job.
  await go(page, 'Usages');
  await expect(page.getByRole('region', { name: 'Completed runs' }).locator('strong')).toHaveText('2');
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

test('editor validation never replaces a good draft or counts failed builds', async ({ page }) => {
  await page.goto('/obfuscate');
  const picker = page.getByLabel('Open Lua or Luau source');
  for (const [name, buffer, message] of [
    ['place.rbxl', Buffer.alloc(1), 'Open a .luau or .lua'], ['bad.lua', Buffer.from([255]), 'UTF-8'],
    ['binary.luau', Buffer.from([0]), 'not a text script'], ['huge.lua', Buffer.alloc(512 * 1024 + 1), '512 KiB'],
  ] as const) {
    await picker.setInputFiles({ name, buffer, mimeType: 'application/octet-stream' }); await expect(page.getByRole('alert')).toContainText(message);
    await expect.poll(() => codeText(page.getByLabel('Source code'))).toMatch(/local settings/);
  }
  const src = page.getByLabel('Source code'); await src.fill('return [=[unfinished'); await src.press('Control+Enter');
  await expect(page.getByRole('alert')).toContainText('no closing bracket');
  await expect(page.getByLabel('Build output', { exact: true })).toHaveCount(0);
  await go(page, 'Usages'); await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page, 'Obfuscate'); await expect.poll(() => codeText(src)).toBe('return [=[unfinished');
});
