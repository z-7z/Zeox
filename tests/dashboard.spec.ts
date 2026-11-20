import { test, expect } from '@playwright/test';
import { attach } from './attachments';
import { go, openSidebar, sidebar } from './navigation';

test('reference layout has a KPI strip, wide trend, two bottom panes and a radial summary at the right', async ({ page }) => {
  await page.goto('/'); await expect(page.getByRole('heading', { name: 'Daily processed volume' })).toBeVisible();
  const [stats, trend, left, right, side] = await Promise.all(['.ov-kpis','.ov-trend','.ov-session','.ov-mix','.overview-side'].map(s => page.locator(s).boundingBox()));
  expect(trend!.x).toBe(stats!.x); expect(trend!.width).toBe(stats!.width); expect(trend!.y).toBeCloseTo(stats!.y + stats!.height, 0);
  expect(left!.y).toBe(right!.y); expect(left!.y).toBeCloseTo(trend!.y + trend!.height + 1, 0);
  expect(side!.y).toBe(stats!.y); expect(side!.x).toBeCloseTo(stats!.x + stats!.width, 0); expect(trend!.width).toBeGreaterThan(side!.width * 2);
  await expect(page.locator('.ov-kpis dt')).toHaveText(['Export rate', 'Files processed', 'Avg. input size']);
  await expect(page.locator('.gauge-face svg line')).toHaveCount(56); await expect(page.locator('.gauge-copy strong')).toHaveText('1,842');
  await expect(page.locator('.exports-track i')).toHaveCount(80); await expect(page.locator('.mix-bands > div')).toHaveCount(3);
});

test('sample period, chart cursor and accessible detail tables stay in sync without recording activity', async ({ page }) => {
  await page.goto('/'); const slider = page.getByRole('slider'), period = page.getByLabel('Sample period');
  await expect(page.getByText('Sample charts', { exact: true })).toBeVisible(); await expect(slider).toHaveAttribute('aria-valuemax','30');
  await slider.focus(); await slider.press('Home'); await expect(slider).toHaveAttribute('aria-valuetext', 'Apr 16, 72 MB');
  await slider.press('ArrowRight'); await expect(page.locator('.trend-tip')).toContainText('Apr 17');
  const dialog = page.getByRole('dialog');
  for (const [button, title, rows] of [['View daily volume table','Daily processed volume',31],['View breakdown','File distribution',6],['Details','Operation mix',4]] as const) {
    const trigger = page.getByRole('button', { name: button, exact: true }); await trigger.focus(); await trigger.press('Enter');
    await expect(dialog).toHaveAccessibleName(title); await expect(dialog.getByRole('row')).toHaveCount(rows);
    if (rows === 31) await expect(dialog.locator('.chosen-row')).toContainText('Apr 17');
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  }
  await period.selectOption('7'); await expect(page.locator('.ws-dates')).toContainText('May 9 – May 15'); await expect(slider).toHaveAttribute('aria-valuemax','7');
  await expect(page.locator('.ov-kpis strong').nth(1)).toHaveText('487'); await expect(page.locator('.gauge-copy strong')).toHaveText('487');
  await slider.press('Home'); await expect(slider).toHaveAttribute('aria-valuetext', 'May 9, 86 MB');
  await page.getByRole('button', { name: 'View breakdown' }).click(); await expect(dialog.getByRole('row').nth(1)).toContainText('Luau192');
  await dialog.getByRole('button', { name: 'Close chart details' }).click(); await expect(page.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'View usages' }).click(); await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page,'Dashboard'); await expect(period).toHaveValue('7');
});

test('quick actions open the actual tools, with real counts and recent operations in the session pane', async ({ page }) => {
  await page.goto('/');
  const summary = page.getByRole('region', { name: 'Session summary' }); await expect(summary.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'Obfuscate file' }).click(); await attach(page);
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('1 completed run', { exact: true })).toBeVisible();
  const recent = summary.getByRole('list', { name: 'Recent runs' }); await expect(recent.getByRole('listitem')).toContainText('Source build');
  await page.getByRole('link', { name: 'Open Vault' }).click(); await page.getByRole('button', { name: 'Use sample' }).click();
  const secret = 'local test sample phrase'; await page.getByLabel('Passphrase', { exact: true }).fill(secret);
  await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret); await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('2 completed runs')).toBeVisible();
  await expect(recent.locator('li span')).toHaveText(['Encryption', 'Source build']); await expect(summary).not.toContainText('game-config');
  await summary.getByRole('link', { name: 'View report' }).click(); await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Clear usage' }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('No runs yet')).toBeVisible();
});

test('loading state and offline export share the full-width report panes, without scripts, requests or session data', async ({ page, context }) => {
  // Hold only the lazy page module so the actual in-app fallback is observable.
  let release!: () => void; const hold = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/(?:src\/pages\/Dashboard\.tsx|assets\/Dashboard-[^/]+\.js)(?:\?.*)?$/, async route => { await hold; await route.continue(); });
  await page.goto('/dashboard', { waitUntil: 'commit' });
  const loading = page.getByRole('status', { name: 'Opening dashboard' }); let tiles: string;
  try { await expect(loading.locator('.sk-card')).toHaveCount(7); await expect(loading.locator('.overview-side .sk-card')).toHaveCount(3); tiles = await loading.innerHTML(); }
  finally { release(); }
  await expect(page.getByRole('slider')).toBeVisible(); await page.waitForLoadState('networkidle'); await context.setOffline(true);
  const [file] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download skeleton' }).click()]);
  expect(file.suggestedFilename()).toBe('zeox-overview-skeleton.html'); const stream = await file.createReadStream(); const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk); const html = Buffer.concat(chunks).toString();
  expect(html).not.toMatch(/<script|<link|https?:\/\/|settings\.luau|game-config/); expect(html).not.toMatch(/shimmer|backdrop-filter|gradient\(|max-width:1500px/);
  const standalone = await context.newPage(), requests: string[] = []; standalone.on('request', req => requests.push(req.url()));
  await standalone.setContent(html); expect(await standalone.locator('.db-skeleton').innerHTML()).toBe(tiles);
  await expect(standalone.locator('.sk-card')).toHaveCount(7);
  expect(await standalone.locator('.overview-grid').evaluate(el => el.getBoundingClientRect().width)).toBe(await standalone.evaluate(() => document.documentElement.clientWidth));
  const side = standalone.locator('.overview-side'), trend = standalone.locator('.ov-trend');
  expect((await side.boundingBox())!.x).toBeCloseTo((await trend.boundingBox())!.width, 0);
  await standalone.setViewportSize({ width: 390, height: 844 }); expect((await side.boundingBox())!.x).toBe(0); expect((await side.boundingBox())!.y).toBeGreaterThan((await trend.boundingBox())!.y);
  expect(await standalone.locator('.sk-card').first().evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
  expect(requests).toEqual([]);
});

test('desktop sidebar can disappear entirely without losing an attachment or changing routes', async ({ page }) => {
  await page.goto('/obfuscate'); await attach(page, 'tune.lua');
  const intake = page.getByRole('group', { name: 'Source file' }); await expect(intake).toContainText('tune.lua');
  const before = await page.locator('.ws-frame').boundingBox(); await page.getByRole('button', { name: 'Hide sidebar' }).click();
  await expect(sidebar(page)).toHaveCount(0); await expect(page.getByRole('button', { name: 'Open sidebar' })).toHaveAttribute('aria-expanded', 'false');
  expect((await page.locator('.ws-frame').boundingBox())!.width).toBeGreaterThan(before!.width + 50);
  await page.keyboard.press('/'); await expect(intake).toContainText('tune.lua'); await expect(page.getByRole('dialog')).toHaveCount(0);
  await page.getByRole('link', { name: 'Zeox home' }).click(); await expect(sidebar(page)).toHaveCount(0);
  await page.getByRole('link', { name: 'Obfuscate file' }).click(); await expect(intake).toContainText('tune.lua');
  await openSidebar(page); await expect(sidebar(page).locator('[aria-current=page]')).toHaveAccessibleName('Obfuscate');
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
