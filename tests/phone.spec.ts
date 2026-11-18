import { expect, test } from '@playwright/test';
import { openSidebar, sidebar } from './navigation';

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

test('touch drawer gives the page its full width in portrait and short landscape', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/');
  const open = page.getByRole('button', { name: 'Open sidebar' });
  await expect(open).toHaveAttribute('aria-expanded', 'false'); await expect(sidebar(page)).toHaveCount(0);
  const tool = page.getByRole('link', { name: 'Open editor' }), other = page.getByRole('link', { name: 'Open vault' });
  const [a,b] = await Promise.all([tool.boundingBox(), other.boundingBox()]);
  expect(b!.x).toBeGreaterThan(a!.x + a!.width); expect(a!.y + a!.height).toBeLessThan(370);
  await open.tap(); await sidebar(page).getByRole('link', { name: 'Obfuscate' }).tap();
  await expect(page.getByRole('textbox', { name: 'Source code' })).toBeVisible();
  expect(await page.getByRole('button', { name: 'Build output' }).evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  await open.tap(); await sidebar(page).getByRole('link', { name: 'Vault' }).tap();
  const submit = page.getByRole('button', { name: 'Encrypt file', exact: true }); await expect(submit).toBeVisible();
  expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  await page.setViewportSize({ width: 844, height: 390 });
  await expect(open).toBeVisible(); await expect(sidebar(page)).toHaveCount(0);
  await open.tap(); await expect((await openSidebar(page)).getByRole('link')).toHaveCount(4);
  await sidebar(page).getByRole('link', { name: 'Usages' }).tap(); await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(844);
});
