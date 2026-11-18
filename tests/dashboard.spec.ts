import { test, expect } from '@playwright/test';
import { go, openSidebar, sidebar } from './navigation';

test('reference artwork has two large cards above the four original widget shapes', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('.db-grid > section');
  await expect(cards).toHaveCount(6);
  const bounds = await cards.evaluateAll(els => els.map(el => {
    const { x, y, width, height, right } = el.getBoundingClientRect(); return { x, y, width, height, right, name: el.getAttribute('aria-label') };
  }));
  expect(bounds.map(b => b.name)).toEqual(['Export rate', 'Total files', 'Input formats', 'Session summary', 'Volume by hour', 'Quick actions']);
  const [funnel, mix, ...widgets] = bounds;
  expect(mix.y).toBe(funnel.y); expect(mix.x).toBeGreaterThan(funnel.right); expect(mix.width).toBeCloseTo(funnel.width, 0);
  expect(widgets[0].y).toBeGreaterThan(funnel.y + funnel.height); expect(widgets[0].x).toBe(funnel.x); expect(widgets[3].right).toBeCloseTo(mix.right);
  for (const [i, w] of widgets.entries()) {
    expect(w.y).toBe(widgets[0].y); expect(w.width).toBeCloseTo(widgets[0].width, 0); if (i) expect(w.x).toBeGreaterThan(widgets[i-1].right);
  }
  await expect(cards.locator('.stage-rate')).toHaveText(['100%', '53%', '23%', '8%']);
  await expect(cards.locator('.ribbon-surface')).toHaveCount(4); await expect(cards.locator('.hatched-pie pattern')).toHaveCount(5);
  await expect(cards.locator('.pie-wedge')).toHaveCount(5); await expect(cards.locator('.legend-percent')).toHaveText(['37.9%', '28.0%', '15.0%', '12.0%', '7.1%']);
  await expect(cards.locator('.segment-track')).toHaveCount(5); await expect(cards.locator('.avatar-stack img')).toHaveCount(3);
  await expect(cards.locator('.heat-row')).toHaveCount(7); await expect(cards.locator('.heat-cells > span')).toHaveCount(7 * 24);
});

test('sample charts open accessible detail tables and return focus without recording a run', async ({ page }) => {
  await page.goto('/');
  const dialog = page.getByRole('dialog'); await expect(page.getByText('Sample charts', { exact: true })).toBeVisible();
  for (const [selector, index, title, row] of [
    ['.funnel-stage', 1, 'Export funnel', 'Imported38,20053.1%'], ['.legend-entry', 3, 'File distribution', 'Models22112.0%'],
    ['.input-list button', 2, 'Input formats', 'Roblox places1,60015.7%'],
  ] as const) {
    const button = page.locator(selector).nth(index); await button.focus(); await button.press('Enter');
    await expect(dialog).toHaveAccessibleName(title); await expect(dialog.locator('.chosen-row')).toHaveText(row);
    await page.keyboard.press('Escape'); await expect(button).toBeFocused(); await expect(dialog).toHaveCount(0);
  }
  await page.getByRole('button', { name: 'Inspect processed volume by day' }).click();
  await expect(dialog.getByRole('row')).toHaveCount(8); await expect(dialog.getByRole('row').nth(6)).toContainText('Sat');
  await dialog.getByRole('button', { name: 'Close chart details' }).click(); await expect(page.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'View usages' }).click(); await expect(page.getByText('No usage yet')).toBeVisible();
});

test('quick actions open the actual tools, with real counts and recent operations in the portrait card', async ({ page }) => {
  await page.goto('/');
  const summary = page.getByRole('region', { name: 'Session summary' }); await expect(summary.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'Open editor' }).click(); await page.getByRole('button', { name: 'Build output' }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('1 completed run', { exact: true })).toBeVisible();
  const recent = summary.getByRole('list', { name: 'Recent runs' }); await expect(recent.getByRole('listitem')).toContainText('Source build');
  await page.getByRole('link', { name: 'Open vault' }).click(); await page.getByRole('button', { name: 'Use sample' }).click();
  const secret = 'glass test sample phrase'; await page.getByLabel('Passphrase', { exact: true }).fill(secret);
  await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret); await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('2 completed runs')).toBeVisible();
  await expect(recent.locator('li span')).toHaveText(['Encryption', 'Source build']); await expect(summary).not.toContainText('game-config');
  await summary.getByRole('link', { name: 'View report' }).click(); await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Clear usage' }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('No runs yet')).toBeVisible();
});

test('loading state and offline export share all six slots, without scripts, requests or session data', async ({ page, context }) => {
  // Hold only the lazy page module so the actual in-app fallback is observable.
  let release!: () => void; const hold = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/(?:src\/pages\/Dashboard\.tsx|assets\/Dashboard-[^/]+\.js)(?:\?.*)?$/, async route => { await hold; await route.continue(); });
  await page.goto('/dashboard', { waitUntil: 'commit' });
  const loading = page.getByRole('status', { name: 'Opening dashboard' }); let tiles: string;
  try { await expect(loading.locator('.status-card')).toHaveCount(2); await expect(loading.locator('.widget-card')).toHaveCount(4); tiles = await loading.innerHTML(); }
  finally { release(); }
  await expect(page.locator('.db-grid > section')).toHaveCount(6); await page.waitForLoadState('networkidle'); await context.setOffline(true);
  const [file] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download skeleton' }).click()]);
  expect(file.suggestedFilename()).toBe('zeox-overview-skeleton.html'); const stream = await file.createReadStream(); const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk); const html = Buffer.concat(chunks).toString();
  expect(html).not.toMatch(/<script|<link|https?:\/\/|settings\.luau|game-config/); expect(html).toContain('prefers-reduced-motion');
  const standalone = await context.newPage(), requests: string[] = []; standalone.on('request', req => requests.push(req.url()));
  await standalone.setContent(html); expect(await standalone.locator('.db-skeleton').innerHTML()).toBe(tiles);
  await expect(standalone.locator('.sk-card')).toHaveCount(6);
  const rows = () => standalone.locator('.sk-card').evaluateAll(els => els.map(el => el.getBoundingClientRect().y));
  const desktop = await rows(); expect(new Set(desktop).size).toBe(2); expect(desktop[1]).toBe(desktop[0]); expect(desktop[2]).toBeGreaterThan(desktop[1]);
  await standalone.setViewportSize({ width: 390, height: 844 }); expect(new Set(await rows()).size).toBe(6);
  await standalone.emulateMedia({ reducedMotion: 'reduce' });
  expect(await standalone.locator('.sk-card').first().evaluate(el => getComputedStyle(el, '::after').animationName)).toBe('none');
  expect(requests).toEqual([]);
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
  await page.goto('/'); const card = page.getByRole('region', { name: 'Export rate' });
  await expect(card).toHaveCSS('backdrop-filter', 'none'); await expect(card).toHaveCSS('background-color', 'rgb(15, 15, 15)');
  await page.getByRole('link', { name: 'Open editor' }).click(); await expect(page.getByRole('textbox', { name: 'Source code' }).locator('.sx-keyword').first()).toBeVisible();
});
