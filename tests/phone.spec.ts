import { expect, test } from '@playwright/test';
import { openSidebar, sidebar } from './navigation';

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

test('touch drawer gives the page its full width in portrait and short landscape', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/');
  const open = page.getByRole('button', { name: 'Open sidebar' });
  await expect(open).toHaveAttribute('aria-expanded', 'false'); await expect(sidebar(page)).toHaveCount(0);
  // The funnel and pie stack at full width, with room for the legend next to the pie.
  const funnel = page.getByRole('region', { name: 'Export rate' }), mix = page.getByRole('region', { name: 'Total files' });
  const [a, b, pie, legend] = await Promise.all([funnel.boundingBox(), mix.boundingBox(), mix.locator('.hatched-pie').boundingBox(), mix.locator('ul').boundingBox()]);
  expect(a!.width).toBeGreaterThanOrEqual(290); expect(b!.width).toBe(a!.width); expect(b!.x).toBe(a!.x);
  expect(b!.y).toBeGreaterThan(a!.y + a!.height); expect(b!.y + b!.height).toBeLessThan(568);
  expect(legend!.x).toBeGreaterThanOrEqual(pie!.x + pie!.width); expect(legend!.y + legend!.height).toBeLessThan(b!.y + b!.height);
  await open.tap(); await sidebar(page).getByRole('link', { name: 'Obfuscate' }).tap();
  await expect(page.getByRole('button', { name: 'Choose file' })).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveCount(0);
  expect(await page.getByRole('button', { name: 'Obfuscate file' }).evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  await open.tap(); await sidebar(page).getByRole('link', { name: 'Vault' }).tap();
  const submit = page.getByRole('button', { name: 'Encrypt file', exact: true }); await expect(submit).toBeVisible();
  expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(open).toBeVisible(); await expect(sidebar(page)).toHaveCount(0);
  await open.tap(); await expect((await openSidebar(page)).getByRole('link')).toHaveCount(4);
  await sidebar(page).getByRole('link', { name: 'Usages' }).tap(); await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(844);
});
