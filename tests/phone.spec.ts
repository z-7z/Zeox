import { expect, test } from '@playwright/test';
import { toolNav } from './navigation';

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

test('touch rail stays narrow, opens over the page, and leaves file actions in reach in either orientation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/');
  const opener = page.getByRole('button', { name: 'Expand sidebar' }), nav = toolNav(page), main = page.locator('main');
  await expect(page.getByRole('button', { name: 'Choose file' })).toBeInViewport();
  await page.evaluate(() => document.fonts.ready); const before = (await main.boundingBox())!;
  await expect(opener).toHaveAttribute('aria-expanded', 'false'); await expect(nav).toBeVisible();
  expect(before.x).toBeLessThanOrEqual(64); expect(before.width).toBeGreaterThanOrEqual(256);
  await expect(page.getByRole('textbox')).toHaveCount(0);
  expect(await page.getByRole('button', { name: 'Obfuscate file' }).evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  await opener.tap(); const drawer = page.getByRole('dialog', { name: 'Workspace menu' });
  await expect(drawer).toBeVisible(); expect(await main.boundingBox()).toEqual(before);
  await expect(nav.getByRole('link', { name: 'Vault', exact: true }).locator('.side-label')).toBeVisible();
  await nav.getByRole('link', { name: 'Vault', exact: true }).tap(); await expect(drawer).toHaveCount(0);
  const submit = page.getByRole('button', { name: 'Encrypt file', exact: true }); await expect(submit).toBeInViewport();
  expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  for (const [width,height] of [[568,320],[844,390]]) {
    await page.setViewportSize({ width, height });
    await expect(opener).toBeVisible(); await expect(nav).toBeVisible();
    expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  // The lower links and utilities are reachable by scrolling the rail, not the document.
  await nav.getByRole('link', { name: 'Usages', exact: true }).tap(); await expect(page).toHaveURL(/\/usages$/);
  await expect(page.getByRole('tooltip')).toHaveCount(0);
  await opener.tap(); await page.getByRole('button', { name: 'Settings', exact: true }).tap();
  await expect(page.getByRole('dialog', { name: 'Settings' })).toBeVisible(); await expect(drawer).toHaveCount(0);
  await page.getByRole('button', { name: 'Close settings' }).tap();
  await expect(page.getByRole('button', { name: 'Settings', exact: true })).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
});
