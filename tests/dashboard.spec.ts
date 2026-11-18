import { test, expect } from '@playwright/test';
import { go, openSidebar, sidebar } from './navigation';

test('dashboard links open the real tools; its status cards use successful session operations', async ({ page }) => {
  await page.goto('/');
  const summary = page.getByRole('region', { name: 'Session summary' });
  await expect(summary.locator('dd')).toHaveText(['0', '0', '0']); await expect(page.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'Open editor' }).click(); await page.getByRole('button', { name: 'Build output' }).click();
  await go(page, 'Dashboard'); await expect(summary.locator('dd')).toHaveText(['1', '0', '0']);
  const recent = page.getByRole('region', { name: 'Recent runs' }); await expect(recent.getByRole('listitem')).toContainText('Source build');
  await page.getByRole('link', { name: 'Open vault' }).click(); await page.getByRole('button', { name: 'Use sample' }).click();
  const secret = 'glass test sample phrase'; await page.getByLabel('Passphrase', { exact: true }).fill(secret);
  await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret); await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await go(page, 'Dashboard'); await expect(summary.locator('dd')).toHaveText(['1', '1', '0']);
  await expect(recent.locator('li span')).toHaveText(['Encryption', 'Source build']); await expect(recent).not.toContainText('game-config');
  await recent.getByRole('link', { name: 'View report' }).click(); await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Clear usage' }).click();
  await go(page, 'Dashboard'); await expect(summary.locator('dd')).toHaveText(['0', '0', '0']);
});

test('skeleton download matches the four slots and opens offline without scripts or session data', async ({ page, context }) => {
  await page.goto('/dashboard', { waitUntil: 'networkidle' }); await context.setOffline(true);
  const real = await page.locator('.overview-grid > *').evaluateAll(els => els.map(el => el.getBoundingClientRect().width));
  expect(real).toHaveLength(4);
  const [file] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download skeleton' }).click()]);
  expect(file.suggestedFilename()).toBe('zeox-overview-skeleton.html'); const stream = await file.createReadStream(); const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk); const html = Buffer.concat(chunks).toString();
  expect(html).not.toMatch(/<script|<link|https?:\/\/|settings\.luau|game-config/); expect(html).toContain('prefers-reduced-motion');
  await page.setContent(html); await expect(page.locator('.overview-grid .sk-tile')).toHaveCount(4); await expect(page.locator('.overview-portal')).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.locator('.sk-tile').first().evaluate(el => getComputedStyle(el, '::after').animationName)).toBe('none');
});

test('desktop sidebar can disappear entirely without losing a draft or changing routes', async ({ page }) => {
  await page.goto('/obfuscate'); const editor = page.getByRole('textbox', { name: 'Source code' }); await editor.fill('return 12');
  const before = await page.locator('.ws-frame').boundingBox(); await page.getByRole('button', { name: 'Hide sidebar' }).click();
  await expect(sidebar(page)).toHaveCount(0); await expect(page.getByRole('button', { name: 'Open sidebar' })).toHaveAttribute('aria-expanded', 'false');
  expect((await page.locator('.ws-frame').boundingBox())!.width).toBeGreaterThan(before!.width + 50);
  await editor.press('End'); await editor.press('/'); await expect(editor).toHaveText('return 12/'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('link', { name: 'Zeox home' }).click(); await expect(sidebar(page)).toHaveCount(0);
  await page.getByRole('link', { name: 'Open editor' }).click(); await expect(editor).toHaveText('return 12/');
  await openSidebar(page); await expect(sidebar(page).locator('[aria-current=page]')).toHaveText('Obfuscate');
});

test('mobile drawer contains focus, dismisses from keyboard, button and backdrop, and releases scroll on resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 }); await page.goto('/vault');
  const opener = page.getByRole('button', { name: 'Open sidebar' }), dialog = page.getByRole('dialog', { name: 'Workspace navigation' });
  await opener.click(); await expect(dialog).toBeVisible(); await expect(sidebar(page).getByRole('link', { name: 'Vault' })).toBeFocused();
  expect(await dialog.evaluate(el => el.matches(':modal'))).toBe(true);
  await page.keyboard.press('Shift+Tab'); await expect(sidebar(page).getByRole('link', { name: 'Usages' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused(); await expect(dialog).toHaveCount(0);
  await opener.click(); await page.mouse.click(375, 135); await expect(opener).toBeFocused();
  await opener.click(); await page.getByRole('button', { name: 'Close sidebar' }).click(); await expect(opener).toBeFocused();
  await opener.click(); await page.setViewportSize({ width: 1024, height: 720 });
  await expect(dialog).toHaveCount(0); await expect(sidebar(page).getByRole('link')).toHaveCount(4);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await page.setViewportSize({ width: 390, height: 640 }); await expect(opener).toBeVisible(); await expect(sidebar(page)).toHaveCount(0);
});

test('reduced transparency uses opaque surfaces while controls and artwork stay legible', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
  await page.goto('/'); const card = page.getByRole('link', { name: 'Open editor' });
  await expect(card).toHaveCSS('backdrop-filter', 'none'); await expect(card).toHaveCSS('background-color', 'rgb(27, 27, 27)');
  await card.click(); await expect(page.getByRole('textbox', { name: 'Source code' }).locator('.sx-keyword').first()).toBeVisible();
});
