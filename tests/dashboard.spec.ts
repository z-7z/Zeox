import { expect, test } from './guest-workspace';
import { attach, downloadOutput } from './attachments';
import { go } from './navigation';

test('Dashboard follows the attached script, transform settings and real output across navigation', async ({
  page,
}) => {
  await page.goto('/dashboard');
  const script = page.getByRole('region', { name: 'Current script' });
  const count = page.getByRole('region', { name: 'Script builds' }).locator('strong');
  const settings = page.getByRole('region', { name: 'Build settings', exact: true });
  await expect(script).toContainText('Not attached');
  await expect(count).toHaveText('0');
  await expect(page.getByRole('combobox', { name: 'Sample period' })).toHaveCount(0);
  await page.getByRole('link', { name: 'Obfuscate a script' }).click();
  await attach(page, 'example.lua', '-- note\nreturn   "Hi"');
  await page.getByRole('switch', { name: 'Encode text literals' }).uncheck();
  await go(page, 'Dashboard');
  await expect(script).toContainText('example.lua');
  await expect(settings.getByRole('listitem').filter({ hasText: 'Encode text literals' })).toContainText('Off');
  await expect(count).toHaveText('0');
  await page.getByRole('link', { name: 'Continue build' }).click();
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  await go(page, 'Dashboard');
  await expect(script).toContainText('Copy ready');
  await expect(count).toHaveText('1');
  await page.getByRole('link', { name: 'Open download' }).click();
  await expect(page.getByRole('region', { name: 'File download' })).toBeFocused();
  expect(await downloadOutput(page)).toEqual({ name: 'example.compact.lua', bytes: Buffer.from('return "Hi"') });
  await go(page, 'Dashboard');
  await page.getByRole('link', { name: 'Edit settings' }).click();
  await expect(page.getByRole('region', { name: 'Build configuration' })).toBeFocused();
});

test('optional sample report keeps its dates, totals and period separate from the guest session', async ({ page }) => {
  await page.goto('/dashboard');
  const report = page.getByText('Sample report', { exact: true });
  await report.click();
  const totals = page.getByRole('table', { name: 'Sample totals', exact: true });
  const period = page.getByLabel('Sample period');
  await expect(page.getByText(/Apr 16 – May 15, 2026/)).toBeVisible();
  await expect(totals).toContainText('2,549');
  await expect(totals).toContainText('1,842');
  await page.getByText('Daily totals', { exact: true }).click();
  const days = page.getByRole('table', { name: 'Daily sample totals' });
  await expect(days.getByRole('row')).toHaveCount(31);
  await period.click();
  await page.getByRole('option', { name: 'Last 7 days' }).click();
  await expect(page.getByText(/May 9 – May 15, 2026/)).toBeVisible();
  await expect(days.getByRole('row')).toHaveCount(8);
  await expect(totals).toContainText('487');
  await page.getByRole('link', { name: 'View session activity' }).click();
  await expect(page.getByText('No usage yet')).toBeVisible();
  await go(page, 'Dashboard');
  await report.click();
  await expect(period).toHaveText('Last 7 days');
});
