import { expect, test } from '@playwright/test';
import { go } from './navigation';

for (const width of [320, 1440]) {
  test(`all tools share white Dashboard cards in both appearances at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/dashboard');
    for (const appearance of ['dark', 'light']) {
      if (appearance === 'light') await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
      for (const tool of ['Dashboard', 'Usages', 'Obfuscator', 'Encryption'] as const) {
        await go(page, tool);
        const cards = page.locator('main .card:visible');
        expect(await cards.count()).toBeGreaterThanOrEqual(3);
        for (const card of await cards.all()) await expect(card).toHaveCSS('background-color', 'rgb(255, 255, 255)');
        await expect(page.locator('main .page-title h1')).toBeVisible();
        // Some form primitives maintain a visually hidden select for form events.
        // Only the styled controls may be exposed to users.
        const nativeControls = await page
          .locator('main select')
          .evaluateAll((els) => els.filter((el) => el.offsetWidth > 1 && el.offsetHeight > 1).length);
        expect(nativeControls).toBe(0);
      }
    }
  });
}

test('choice lists support keyboard navigation, Escape, outside dismissal and focus return', async ({ page }) => {
  await page.goto('/dashboard');
  const trigger = page.getByRole('combobox', { name: 'Sample period' }),
    menu = page.getByRole('listbox', { name: 'Sample period' });
  await trigger.focus();
  await trigger.press('Enter');
  await expect(menu).toBeVisible();
  await expect(page.getByRole('option', { name: 'Last 30 days' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('option', { name: 'Last 7 days' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveText('Last 30 days');
  await trigger.press('Space');
  await expect(page.getByRole('option', { name: 'Last 30 days' })).toBeFocused();
  await page.keyboard.press('Home');
  await expect(page.getByRole('option', { name: 'Last 7 days' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveText('Last 7 days');
  await expect(menu).toHaveCount(0);
  await trigger.click();
  await expect(menu).toBeVisible();
  await page.mouse.click(5, 5);
  await expect(trigger).toBeFocused();
  await expect(menu).toHaveCount(0);
  await go(page, 'Usages');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Usages');
});

test('a generated passphrase uses the custom range value; cancellation, masking and advanced options stay independent', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/encrypt');
  const pass = page.getByLabel('Passphrase', { exact: true }),
    confirm = page.getByLabel('Confirm passphrase', { exact: true });
  const opener = page.getByRole('button', { name: 'Generate passphrase' }),
    dialog = page.getByRole('dialog', { name: 'Generate a passphrase' });
  const slider = dialog.getByRole('slider', { name: 'Passphrase length' });
  await pass.fill('my own test passphrase');
  await confirm.fill('my own test passphrase');
  await opener.click();
  await expect(slider).toBeFocused();
  await expect(slider).toHaveValue('24');
  await expect(slider).toHaveCSS('appearance', 'none');
  await slider.press('End');
  await expect(slider).toHaveAttribute('aria-valuetext', '64 characters');
  await page.keyboard.press('Escape');
  await expect(opener).toBeFocused();
  await expect(pass).toHaveValue('my own test passphrase');
  await expect(confirm).toHaveValue('my own test passphrase');
  await opener.click();
  await slider.press('Home');
  await slider.press('ArrowRight');
  await expect(slider).toHaveValue('17');
  await dialog.getByRole('button', { name: 'Generate & use' }).click();
  await expect(dialog).toHaveCount(0);
  await expect(pass).toBeFocused();
  await expect(pass).toHaveValue(/^[\w-]{17}$/);
  await expect(confirm).toHaveValue('');
  const visibility = page.getByRole('button', { name: 'Show passphrase' });
  await expect(visibility).toHaveAttribute('aria-pressed', 'true');
  await visibility.click();
  await expect(pass).toHaveAttribute('type', 'password');
  await expect(confirm).toHaveAttribute('type', 'password');
  const verify = page.getByRole('switch', { name: 'Verify archive' });
  await expect(verify).toHaveCount(0);
  await page.getByText('Archive options', { exact: true }).click();
  await verify.focus();
  await verify.press('Space');
  await expect(verify).toBeChecked();
  await page.getByRole('radio', { name: 'Decrypt', exact: true }).check();
  await expect(verify).toHaveCount(0);
  await expect(pass).toHaveValue('');
});

test.describe('touch controls', () => {
  test.use({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  test('tap a filename option, change a generated length by touch and verify the download suggestion', async ({
    page,
  }) => {
    await page.goto('/encrypt');
    await page.getByRole('button', { name: 'Use sample' }).tap();
    await page.getByText('Archive options', { exact: true }).tap();
    const trigger = page.getByRole('combobox', { name: 'Archive filename' });
    await trigger.tap();
    await page.getByRole('option', { name: 'Use archive.zeox' }).tap();
    await expect(trigger).toHaveText('Use archive.zeox');
    await expect(page.getByRole('heading', { name: 'archive.zeox' })).toBeVisible();
    await expect(page.locator('a[download]')).toHaveCount(0);
    await page.getByRole('button', { name: 'Generate passphrase' }).tap();
    const slider = page.getByRole('slider', { name: 'Passphrase length' });
    const box = (await slider.boundingBox())!;
    await page.touchscreen.tap(box.x + box.width * 0.8, box.y + box.height / 2);
    const chosen = Number(await slider.inputValue());
    expect(chosen).toBeGreaterThan(24);
    await page.getByRole('button', { name: 'Generate & use' }).tap();
    const pass = await page.getByLabel('Passphrase', { exact: true }).inputValue();
    expect(pass.length).toBe(chosen);
    await page.getByLabel('Confirm passphrase', { exact: true }).fill(pass);
    await page.getByRole('button', { name: 'Encrypt file', exact: true }).tap();
    await expect(page.getByRole('link', { name: 'Download .zeox' })).toHaveAttribute('download', 'archive.zeox');
  });
});
