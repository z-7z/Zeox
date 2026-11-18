import { test, expect, type Download } from '@playwright/test';

async function contents(download: Download) {
  const stream = await download.createReadStream();
  if (!stream) throw new Error('Download has no content');
  const chunks = [];
  for await (const part of stream) chunks.push(part);
  return Buffer.concat(chunks).toString('utf8');
}

test('the real snapshot replaces six skeleton cards without moving the desktop grid', async ({ page }) => {
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route('**/data/overview.json', async route => { await gate; await route.continue(); });
  await page.goto('/dashboard', { waitUntil: 'domcontentloaded' });
  const loading = page.getByRole('status', { name: 'Loading overview' });
  await expect(loading.locator('.db-card')).toHaveCount(6);
  const box = await loading.boundingBox();
  release();
  await expect(page.getByRole('heading', { name: '7.8%' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '1,842' })).toBeVisible();
  expect((await page.locator('.db-grid').boundingBox())?.height).toBeCloseTo(box!.height);
  await expect(page.locator('.heat-cells > span')).toHaveCount(7 * 24);

  const stage = page.getByRole('button', { name: /^Add to cart:/ });
  await stage.click();
  await expect(page.getByRole('dialog').getByRole('row', { name: /Add to cart 38,200 53.1%/ })).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(stage).toBeFocused();
});

test('a failed snapshot can be retried', async ({ page }) => {
  await page.route('**/data/overview.json', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/dashboard');
  await expect(page.getByRole('alert')).toContainText('Overview unavailable');
  await page.unroute('**/data/overview.json');
  await page.getByRole('button', { name: 'Try again' }).click();
  await expect(page.getByRole('heading', { name: '7.8%' })).toBeVisible();
});

test('team invitations are local, persistent and deduplicated', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Invite Members', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('Email address').fill('teammate@example.org');
  await dialog.getByLabel('Workspace role').selectOption('Viewer');
  await dialog.getByRole('button', { name: 'Create invitation' }).click();
  await expect(dialog).toContainText('Viewer · Pending');
  await dialog.getByLabel('Email address').fill('TEAMMATE@example.org');
  await dialog.getByRole('button', { name: 'Create invitation' }).click();
  await expect(dialog.getByRole('alert')).toContainText('already has a pending invitation');
  await page.reload();
  await expect(page.getByRole('heading', { name: '1 pending invitation' })).toBeVisible();
});

test('search reaches offline skeleton and hourly CSV downloads', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: '1,842' })).toBeVisible();
  await page.keyboard.press('/');
  const search = page.getByRole('combobox', { name: 'Search commands' });
  await search.fill('Download skeleton');
  await search.press('Enter');
  const dialog = page.getByRole('dialog');
  let downloading = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /Download skeleton/ }).click();
  const skeleton = await downloading;
  expect(skeleton.suggestedFilename()).toBe('zeox-overview-skeleton.html');
  const html = await contents(skeleton);
  expect(html).toContain('prefers-reduced-motion');
  expect(html).not.toMatch(/<script|<link/i);
  downloading = page.waitForEvent('download');
  await dialog.getByRole('button', { name: /Export hourly sales/ }).click();
  const csv = await contents(await downloading);
  expect(csv.trim().split('\r\n')).toHaveLength(1 + 7 * 24);
  expect(csv).toContain('Sat,21:00,4800');
  await page.setContent(html);
  await expect(page.locator('.sk-card')).toHaveCount(6);
});

test('390px navigation works without overflow and honors reduced motion', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: '7.8%' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  await page.getByRole('button', { name: 'Open workspace navigation' }).click();
  await page.getByRole('combobox').fill('Downloads');
  await page.getByRole('combobox').press('Enter');
  const skeleton = page.locator('dialog .sk-card').first();
  expect(await skeleton.evaluate(el => getComputedStyle(el, '::after').animationName)).toBe('none');
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: 'Open workspace navigation' })).toBeFocused();
});
