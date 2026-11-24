import { expect, test } from '@playwright/test';
import { openTools, toolNav } from './navigation';

test.use({ isMobile: true, hasTouch: true, deviceScaleFactor: 3 });

test('touch tool menu gives the page its full width in portrait and short landscape', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 }); await page.goto('/dashboard');
  const open = page.getByRole('button', { name: 'Open tools' });
  await expect(open).toHaveAttribute('aria-expanded', 'false'); await expect(toolNav(page)).toHaveCount(0);
  // On phones the trace and format bars span both columns; yield and the tape share a row.
  const trend = page.getByRole('region', { name: 'Daily processed volume' }), gauge = page.getByRole('region', { name: 'File distribution' });
  const [a,b] = await Promise.all([trend.boundingBox(),gauge.boundingBox()]); expect(a!.x).toBe(10); expect(a!.width).toBe(300); expect(b!.width).toBe(a!.width);
  expect(b!.y).toBeGreaterThanOrEqual(a!.y + a!.height); await expect(page.getByLabel('Sample period')).toBeInViewport();
  const mint=(await page.locator('.yield-card').boundingBox())!, tape=(await page.locator('.batch-tape').boundingBox())!;
  expect(mint.y).toBe(tape.y); expect(tape.x).toBeGreaterThan(mint.x+mint.width);
  await open.tap(); await toolNav(page).getByRole('link', { name: 'Obfuscator' }).tap();
  await expect(page.getByRole('button', { name: 'Choose file' })).toBeVisible();
  await expect(page.getByRole('textbox')).toHaveCount(0);
  expect(await page.getByRole('button', { name: 'Obfuscate file' }).evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  await open.tap(); await toolNav(page).getByRole('link', { name: 'Vault' }).tap();
  const submit = page.getByRole('button', { name: 'Encrypt file', exact: true }); await expect(submit).toBeVisible();
  expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThan(568);
  for (const [width,height] of [[568,320],[844,390]]) {
    await page.setViewportSize({ width, height });
    await expect(open).toBeVisible(); await expect(toolNav(page)).toHaveCount(0);
    expect(await submit.evaluate(el => el.getBoundingClientRect().bottom)).toBeLessThanOrEqual(height);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
  await open.tap(); await expect((await openTools(page)).getByRole('link')).toHaveCount(4);
  await toolNav(page).getByRole('link', { name: 'Usages' }).tap(); await expect(page.getByRole('dialog')).toHaveCount(0);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(844);
});
