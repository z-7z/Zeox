import { expect, test } from '@playwright/test';
import { attach } from './attachments';
import { expectToolsAt, go, toolNav } from './navigation';

test('dock stays in one row while scrolling and rotating, then becomes the left rail without remounting the tool', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/obfuscate');
  await attach(page, 'orientation.luau');
  for (const [width, height] of [
    [390, 844],
    [844, 390],
    [320, 568],
  ]) {
    await page.setViewportSize({ width, height });
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expectToolsAt(page, 'bottom');
    // Even the last control can be scrolled completely above the dock.
    const box = await page.getByRole('switch', { name: 'Compact spacing' }).boundingBox();
    expect(box!.y + box!.height).toBeLessThan((await toolNav(page).boundingBox())!.y);
    const help = toolNav(page).getByRole('button', { name: 'Help' });
    await help.click();
    await expect(page.getByRole('dialog', { name: 'Workspace guide' })).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(help).toBeFocused();
  }
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.evaluate(() => window.scrollTo(0, 0));
  await expectToolsAt(page, 'left');
  await expect(page.getByRole('group', { name: 'Source file' })).toContainText('orientation.luau');
  await expect(page.getByRole('button', { name: 'Obfuscate file' })).toBeEnabled();
});

test('finder, appearance, activity and privacy controls work without leaving tab memory', async ({ page }) => {
  await page.goto('/');
  const finder = page.getByRole('button', { name: 'Search tools' });
  await finder.focus();
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog'),
    input = dialog.getByRole('searchbox');
  await expect(input).toBeFocused();
  await input.fill('no matching tool');
  await expect(dialog.getByRole('status')).toHaveText('No matching tools.');
  await page.keyboard.press('Escape');
  await expect(finder).toBeFocused();
  await finder.click();
  await expect(input).toHaveValue('');
  await input.fill('restore');
  await expect(dialog.getByRole('link')).toHaveCount(1);
  await input.press('Enter');
  await expect(page).toHaveURL(/\/encrypt$/);
  await expect(dialog).toHaveCount(0);
  await expect(page.getByRole('main')).toBeFocused();
  await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
  await go(page, 'Obfuscator');
  await expect(page.getByRole('button', { name: 'Light mode: switch to dark' })).toBeVisible();
  await attach(page);
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  const inbox = page.getByRole('button', { name: 'Session activity', exact: true });
  await expect(inbox).toHaveAccessibleDescription('1 completed run');
  await inbox.click();
  await expect(dialog).toContainText('Source build');
  await dialog.getByRole('link', { name: 'View full ledger' }).click();
  await expect(page).toHaveURL(/\/usages$/);
  await expect(page.getByRole('table')).toContainText('Source build');
  await page.getByRole('button', { name: 'Local workspace information' }).click();
  await expect(dialog).toContainText('No account');
  await dialog.getByRole('button', { name: 'Close dialog' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Dark mode: switch to light' })).toBeVisible();
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
});

test('striped plot offers keyboard readings, an accessible data table and an actual reference CSV', async ({
  page,
}) => {
  await page.goto('/obfuscate');
  await page.getByText('Encoding reference', { exact: true }).click();
  const panel = page.getByRole('region', { name: 'Literal encoding breakdown' });
  const bars = panel.getByRole('group').getByRole('button');
  await expect(bars).toHaveCount(9);
  await expect(bars.nth(2)).toHaveAttribute('aria-pressed', 'true');
  await bars.nth(2).focus();
  await page.keyboard.press('End');
  await expect(bars.last()).toBeFocused();
  await expect(bars.last()).toHaveAttribute('aria-pressed', 'true');
  await expect(bars.last()).toHaveAccessibleName(/Decimal: 117.*Hex: 0x75/);
  await page.keyboard.press('Escape');
  await expect(panel.locator('.reading')).toHaveCount(0);
  await page.keyboard.press('Home');
  await expect(panel.locator('.reading')).toContainText('Byte 01');
  const open = panel.getByRole('button', { name: /view .* table/i });
  await open.click();
  const dialog = page.getByRole('dialog', { name: 'Literal encoding breakdown' });
  await expect(dialog.getByRole('table').getByRole('row')).toHaveCount(10);
  await page.keyboard.press('Escape');
  await expect(open).toBeFocused();
  const saved = page.waitForEvent('download');
  await panel.getByRole('button', { name: /export .* csv/i }).click();
  const csv = await saved;
  expect(csv.suggestedFilename()).toBe('zeoxfucator-byte-reference.csv');
  const stream = await csv.createReadStream(),
    chunks: Buffer[] = [];
  for await (const c of stream!) chunks.push(c);
  const lines = Buffer.concat(chunks).toString().trim().split('\r\n');
  expect(lines).toHaveLength(10);
  expect(lines[1]).toBe('1,90,0x5A,\\090');
});

test('the source workbench exposes its controls directly, preserves the file and links to encryption', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/?from=bookmark#build-settings');
  await expect(page).toHaveURL(/\/obfuscate\?from=bookmark#build-settings$/);
  await expect(page.getByRole('region', { name: 'Build configuration' })).toBeFocused();
  const comments = page.getByRole('switch', { name: 'Remove comments' });
  await attach(page, 'pipeline.lua');
  await comments.uncheck();
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  await expect(page.getByRole('heading', { name: 'pipeline.obf.lua' })).toBeVisible();
  await page.getByRole('main').getByRole('link', { name: 'File encryption' }).click();
  await expect(page).toHaveURL(/\/encrypt$/);
  await go(page, 'Obfuscator');
  await expect(comments).not.toBeChecked();
  await expect(page.getByRole('link', { name: 'Download file' })).toHaveAttribute('download', 'pipeline.obf.lua');
  await comments.check();
  await expect(page.locator('a[download]')).toHaveCount(0);
});

test('sample breakdown views and their exported days use the selected period', async ({ page }) => {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Formats', exact: true }).click();
  await expect(page.getByRole('table', { name: 'Sample formats' }).getByRole('row', { name: /Luau/ })).toContainText(
    '698',
  );
  await page.getByRole('combobox', { name: 'Sample period' }).click();
  await page.getByRole('option', { name: 'Last 7 days' }).click();
  await expect(page.getByRole('row', { name: /Luau/ })).toContainText('192');
  await page.getByRole('button', { name: 'Operations', exact: true }).click();
  await expect(page.getByRole('row', { name: /Encrypt/ })).toContainText('167');
  const saved = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Export sample report', exact: true }).click();
  const csv = await saved;
  expect(csv.suggestedFilename()).toBe('zeoxfucator-sample-7d.csv');
  const stream = await csv.createReadStream(),
    chunks: Buffer[] = [];
  for await (const c of stream!) chunks.push(c);
  const lines = Buffer.concat(chunks).toString().trim().split('\r\n');
  expect(lines).toHaveLength(8);
  expect(lines[1]).toMatch(/^2026-05-09,/);
  expect(lines[7]).toMatch(/^2026-05-15,/);
  await go(page, 'Usages');
  await expect(page.getByText('No usage yet')).toBeVisible();
});
