import { expect, test } from './guest-workspace';
import { attach } from './attachments';
import { go } from './navigation';

test('dated sample totals and daily rows follow the selected period, separately from local runs', async ({page}) => {
  await page.goto('/dashboard');
  const totals = page.getByRole('table', {name:'Sample totals',exact:true}), period = page.getByLabel('Sample period');
  await expect(page.getByText(/Apr 16 – May 15, 2026/)).toBeVisible();
  await expect(totals).toContainText('2,549'); await expect(totals).toContainText('1,842');
  await page.getByText('Daily totals',{exact:true}).click();
  const days = page.getByRole('table',{name:'Daily sample totals'});
  await expect(days.getByRole('row')).toHaveCount(31); await period.click(); await page.getByRole('option',{name:'Last 7 days'}).click();
  await expect(page.getByText(/May 9 – May 15, 2026/)).toBeVisible();
  await expect(days.getByRole('row')).toHaveCount(8); await expect(totals).toContainText('487');
  await expect(page.getByText(/This tab: 0 completed runs/)).toBeVisible();
  await go(page,'Obfuscator'); await attach(page); await page.getByRole('button',{name:'Obfuscate file'}).click();
  await go(page,'Dashboard'); await expect(period).toHaveText('Last 7 days'); await expect(totals).toContainText('487');
  await expect(page.getByText(/This tab: 1 completed run\./)).toBeVisible();
  await page.getByRole('link',{name:'View usages'}).click(); await expect(page.getByRole('table')).toContainText('Source build');
});
