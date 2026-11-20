import { expect, test } from '@playwright/test';
import { openSidebar, sidebar } from './navigation';

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

test('touch drawer gives the page its full width in portrait and short landscape', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/');
  const open = page.getByRole('button', { name: 'Open sidebar' });
  await expect(open).toHaveAttribute('aria-expanded', 'false'); await expect(sidebar(page)).toHaveCount(0);
  // The narrow report stacks: the trend and gauge each get the entire canvas.
  const trend = page.getByRole('region', { name: 'Daily processed volume' }), gauge = page.getByRole('region', { name: 'File distribution' });
  const [a,b] = await Promise.all([trend.boundingBox(),gauge.boundingBox()]); expect(a!.x).toBe(0); expect(a!.width).toBe(320); expect(b!.width).toBe(a!.width);
  expect(b!.y).toBeGreaterThanOrEqual(a!.y + a!.height); await expect(page.getByLabel('Sample period')).toBeInViewport();
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
