import { test, expect } from '@playwright/test';
import { attach } from './attachments';
import { go, openTools, toolNav } from './navigation';

test('signal desk follows the reference mosaic and opens individual batches and formats', async ({ page }) => {
  await page.goto('/dashboard'); await expect(page.getByRole('heading', { name: 'Throughput' })).toBeVisible();
  const box = async (s:string) => (await page.locator(s).boundingBox())!;
  const [hero,tape,dock,mint,loss,index,live,bars] = await Promise.all(['.signal-main','.batch-tape','.desk-launch','.yield-card','.loss-card','.mix-index','.live-tile','.format-bars'].map(box));
  expect(hero.y).toBe(tape.y); expect(tape.y).toBe(dock.y); expect(hero.width).toBeGreaterThan(tape.width*2); expect(tape.width).toBeGreaterThan(dock.width*1.7);
  expect(mint.x).toBe(hero.x); expect(mint.y).toBe(loss.y); expect(bars.y).toBe(loss.y); expect(bars.x).toBe(tape.x);
  expect(loss.x).toBe(index.x); expect(live.y).toBe(index.y); expect(index.y).toBeGreaterThan(loss.y+loss.height);
  await expect(page.locator('.batch-list li')).toHaveCount(4); await expect(page.locator('.launch-buttons > *')).toHaveCount(4);
  await expect(page.locator('.bar-columns button')).toHaveCount(5); await expect(page.locator('.yield-copy')).toContainText('92.7% export rate');
  await expect(page.locator('.tape-total')).toContainText('1,842');
  await page.getByRole('button',{name:'Inspect May 14 batch'}).click(); await expect(page.locator('.chosen-row')).toContainText('May 14');
  await page.keyboard.press('Escape'); await page.getByRole('button',{name:/Inspect Places:/}).click(); await expect(page.locator('.chosen-row')).toContainText('Places');
});

test('sample period, chart cursor and accessible detail tables stay in sync without recording activity', async ({ page }) => {
  await page.goto('/dashboard'); const slider = page.getByRole('slider'), period = page.getByLabel('Sample period');
  await expect(page.getByText('Sample charts', { exact: true })).toBeVisible(); await expect(slider).toHaveAttribute('aria-valuemax','30');
  await slider.focus(); await slider.press('Home'); await expect(slider).toHaveAttribute('aria-valuetext', 'Apr 16, 72 MB');
  await slider.press('ArrowRight'); await expect(page.locator('.signal-readout')).toContainText('Apr 17');
  const dialog = page.getByRole('dialog');
  for (const [button, title, rows] of [['View daily volume table','Daily processed volume',31],['View breakdown','File distribution',6],['Details','Operation mix',4]] as const) {
    const trigger = page.getByRole('button', { name: button, exact: true }); await trigger.focus(); await trigger.press('Enter');
    await expect(dialog).toHaveAccessibleName(title); await expect(dialog.getByRole('row')).toHaveCount(rows);
    if (rows === 31) await expect(dialog.locator('.chosen-row')).toContainText('Apr 17');
    await page.keyboard.press('Escape'); await expect(trigger).toBeFocused();
  }
  await period.focus(); await period.selectOption('7'); await expect(period).toBeFocused(); await expect(page.locator('.signal-foot time')).toContainText('May 9 – May 15'); await expect(slider).toHaveAttribute('aria-valuemax','7');
  await expect(page.locator('.tape-total')).toContainText('487'); await expect(page.locator('.bar-columns')).toContainText('192');
  await slider.press('Home'); await expect(slider).toHaveAttribute('aria-valuetext', 'May 9, 86 MB');
  await page.getByRole('button', { name: 'View breakdown' }).click(); await expect(dialog.getByRole('row').nth(1)).toContainText('Luau192');
  await dialog.getByRole('button', { name: 'Close chart details' }).click(); await expect(page.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'View usages' }).click(); await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page,'Dashboard'); await expect(period).toHaveValue('7');
});

test('chart inspection and date spacing follow the plot when its width changes', async ({ page }) => {
  await page.setViewportSize({ width: 1366, height: 768 }); await page.goto('/dashboard');
  const plot = page.getByRole('slider'), axis = page.locator('.time-rail');
  await page.getByLabel('Sample period').selectOption('7'); const desktopLabels = await axis.locator('span').count(); expect(desktopLabels).toBeGreaterThanOrEqual(4);
  const before = (await plot.boundingBox())!.width;
  await plot.press('Home'); await plot.press('ArrowRight');
  await page.setViewportSize({ width: 1536, height: 768 });
  await expect(plot).toHaveAttribute('aria-valuenow', '2');
  const wide = (await plot.boundingBox())!; expect(wide.width).toBeGreaterThan(before + 40);
  await plot.click({ position: { x: Math.floor(wide.width) - 1, y: 12 } });
  await expect(plot).toHaveAttribute('aria-valuetext', 'May 15, 92 MB');
  await page.setViewportSize({ width: 390, height: 844 });
  await expect.poll(() => axis.locator('span').count()).toBeLessThan(desktopLabels);
  await plot.click({ position: { x: 1, y: 12 } }); await expect(plot).toHaveAttribute('aria-valuetext', 'May 9, 86 MB');
  for (let day = 1; day <= 7; day++) {
    await expect(plot).toHaveAttribute('aria-valuenow', String(day));
    expect(await axis.evaluate(el => {
      const {left, right} = el.getBoundingClientRect();
      const labels = Array.from(el.querySelectorAll('span,b'), child => child.getBoundingClientRect()).sort((a,b) => a.left - b.left);
      return labels.every((r,i) => r.left >= left - 1 && r.right <= right + 1 && (!i || r.left >= labels[i-1].right));
    })).toBe(true);
    if (day < 7) await plot.press('ArrowRight');
  }
});

test('quick actions open the actual tools, with real counts and recent operations in the session pane', async ({ page }) => {
  await page.goto('/dashboard');
  const summary = page.getByRole('region', { name: 'Session summary' }); await expect(summary.getByText('No runs yet')).toBeVisible();
  await page.getByRole('link', { name: 'Obfuscate file' }).click(); await attach(page);
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('1 run', { exact: true })).toBeVisible();
  const recent = summary.getByRole('list', { name: 'Recent runs' }); await expect(recent.getByRole('listitem')).toContainText('Source build');
  await page.getByRole('link', { name: 'Open Vault' }).click(); await page.getByRole('button', { name: 'Use sample' }).click();
  const secret = 'local test sample phrase'; await page.getByLabel('Passphrase', { exact: true }).fill(secret);
  await page.getByLabel('Confirm passphrase', { exact: true }).fill(secret); await page.getByRole('button', { name: 'Encrypt file', exact: true }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('2 runs')).toBeVisible();
  await expect(recent.locator('li span')).toHaveText(['Encryption', 'Source build']); await expect(summary).not.toContainText('game-config');
  await summary.getByRole('link', { name: 'View report' }).click(); await expect(page.getByRole('table').getByRole('row')).toHaveCount(3);
  await page.getByRole('button', { name: 'Reset', exact: true }).click(); await page.getByRole('button', { name: 'Clear usage' }).click();
  await go(page, 'Dashboard'); await expect(summary.getByText('No runs yet')).toBeVisible();
});

test('loading state and offline export share the eight-card mosaic, without scripts, requests or session data', async ({ page, context }) => {
  // Hold only the lazy page module so the actual in-app fallback is observable.
  await page.setViewportSize({ width: 1366, height: 768 });
  let release!: () => void; const hold = new Promise<void>(resolve => { release = resolve; });
  await page.route(/\/(?:src\/pages\/Dashboard\.tsx|assets\/Dashboard-[^/]+\.js)(?:\?.*)?$/, async route => { await hold; await route.continue(); });
  await page.goto('/dashboard', { waitUntil: 'commit' });
  const loading = page.getByRole('status', { name: 'Opening dashboard' }); let tiles: string, reportWidth: number, trendWidth: number;
  try {
    await expect(loading.locator('.sk-card')).toHaveCount(8); await expect(loading.locator('.yield-card,.loss-card')).toHaveCount(2);
    tiles = await loading.innerHTML(); reportWidth = (await loading.boundingBox())!.width; trendWidth = (await loading.locator('.signal-main').boundingBox())!.width;
    expect(await page.evaluate(() => document.documentElement.scrollHeight)).toBe(768);
  } finally { release(); }
  await expect(page.getByRole('slider')).toBeVisible(); await page.waitForLoadState('networkidle'); await context.setOffline(true);
  expect((await page.locator('.signal-main').boundingBox())!.width).toBeCloseTo(trendWidth, 0);
  const [file] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Download skeleton' }).click()]);
  expect(file.suggestedFilename()).toBe('zeox-overview-skeleton.html'); const stream = await file.createReadStream(); const chunks = [];
  for await (const chunk of stream!) chunks.push(chunk); const html = Buffer.concat(chunks).toString();
  expect(html).not.toMatch(/<script|<link|https?:\/\/|settings\.luau|game-config/); expect(html).not.toMatch(/shimmer|backdrop-filter|gradient\(|max-width:1500px/);
  const standalone = await context.newPage(), requests: string[] = []; standalone.on('request', req => requests.push(req.url()));
  // The export has its own inset, but exactly the same track proportions.
  await standalone.setViewportSize({ width: 1366, height: 768 });
  await standalone.setContent(html); expect(await standalone.locator('.db-skeleton').innerHTML()).toBe(tiles);
  await expect(standalone.locator('.sk-card')).toHaveCount(8);
  const board = standalone.locator('.signal-board'), trend = standalone.locator('.signal-main'), side = standalone.locator('.batch-tape');
  expect((await trend.boundingBox())!.width/(await board.boundingBox())!.width).toBeCloseTo(trendWidth/reportWidth,2);
  await standalone.setViewportSize({width:390,height:844});
  expect((await trend.boundingBox())!.width).toBe((await board.boundingBox())!.width); expect((await side.boundingBox())!.y).toBeGreaterThan((await trend.boundingBox())!.y);
  expect(await standalone.locator('.sk-card').first().evaluate(el => getComputedStyle(el, '::after').content)).toBe('none');
  expect(requests).toEqual([]);
});

test('the home mark returns straight to the file tool and retains its attachment', async ({ page }) => {
  await page.goto('/'); await attach(page, 'tune.lua');
  const intake = page.getByRole('group', { name: 'Source file' }); await expect(intake).toContainText('tune.lua');
  const before = await page.locator('main').boundingBox();
  await openTools(page); await expect(toolNav(page).locator('[aria-current=page]')).toHaveAccessibleName('Obfuscator');
  expect((await page.locator('main').boundingBox())!.width).toBe(before!.width);
  await go(page,'Dashboard'); await page.getByRole('link', { name: 'Zeox home' }).click();
  await expect(page).toHaveURL(/\/$/); await expect(intake).toContainText('tune.lua'); await expect(toolNav(page)).toHaveCount(0);
});

test('the compact tool menu traps focus, supports Escape and backdrop dismissal, and survives resize', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 }); await page.goto('/vault');
  const opener = page.getByRole('button', { name: 'Open tools' }), dialog = page.getByRole('dialog', { name: 'Tools' });
  await opener.click(); await expect(dialog).toBeVisible(); await expect(toolNav(page).getByRole('link', { name: 'Vault' })).toBeFocused();
  expect(await dialog.evaluate(el => el.matches(':modal'))).toBe(true);
  await page.keyboard.press('Shift+Tab'); await expect(toolNav(page).getByRole('link', { name: 'Obfuscator' })).toBeFocused();
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused(); await expect(dialog).toHaveCount(0);
  await opener.click(); await page.mouse.click(375, 135); await expect(opener).toBeFocused();
  await opener.click(); await page.getByRole('button', { name: 'Close tool menu' }).click(); await expect(opener).toBeFocused();
  await opener.click(); await page.setViewportSize({ width: 1024, height: 720 });
  await expect(toolNav(page).getByRole('link')).toHaveCount(4); expect((await dialog.boundingBox())!.height).toBeLessThan(360);
  await go(page, 'Usages'); await expect(dialog).toHaveCount(0);
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});
