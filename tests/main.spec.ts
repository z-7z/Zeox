import { expect, test, type Locator } from '@playwright/test';
import { attach } from './attachments';
import { go, toolNav } from './navigation';

async function readIllustration(image: Locator) {
  await image.scrollIntoViewIfNeeded();
  const loaded = await image.evaluate(async (img: HTMLImageElement) => {
    await img.decode();
    return { src: img.currentSrc, local: new URL(img.currentSrc).origin === location.origin, width: img.naturalWidth };
  });
  expect(loaded.local).toBe(true);
  expect(loaded.width).toBeGreaterThan(0);
  return loaded.src;
}

test('Main is the entry page, with illustrated, theme-matched instructions instead of a file form', async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const main = page.getByRole('main');
  await expect(page).toHaveTitle('Main — ZeoxFucator');
  await expect(main.getByRole('heading', { level: 1, name: 'Main', exact: true })).toBeVisible();
  await expect(toolNav(page).getByRole('link', { name: 'Main', exact: true })).toHaveAttribute('aria-current', 'page');
  await expect(main.locator('form, input[type=file]')).toHaveCount(0);
  await readIllustration(main.getByRole('img', { name: /lilac folder/ }));
  await main.getByRole('link', { name: 'How to use' }).press('Enter');
  const guide = main.getByRole('region', { name: 'How to use ZeoxFucator' });
  await expect(guide).toBeFocused();
  const source = guide.getByRole('article', { name: 'Build a Lua script' });
  const archive = guide.getByRole('article', { name: 'Protect and restore a file' });
  await expect(source.getByRole('listitem')).toHaveCount(3);
  await expect(archive.getByRole('listitem')).toHaveCount(3);
  await expect(source).toContainText('512 KiB');
  await expect(archive).toContainText('25 MB');
  const examples = [source.getByRole('img'), archive.getByRole('img')];
  const dark = [];
  for (const img of examples) dark.push(await readIllustration(img));
  await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
  for (const [i, img] of examples.entries()) expect(await readIllustration(img)).not.toBe(dark[i]);
});

test('home and both walkthroughs navigate in the same tab without clearing an attached file', async ({ page }) => {
  await page.goto('/');
  const main = page.getByRole('main');
  await main.getByRole('link', { name: 'Open Obfuscator' }).click();
  await expect(page).toHaveURL(/\/obfuscate$/);
  await attach(page, 'tour.luau');
  await page.getByRole('link', { name: 'ZeoxFucator home' }).click();
  await expect(page).toHaveTitle('Main — ZeoxFucator');
  await main.getByRole('link', { name: 'Start a build' }).click();
  await expect(page.getByRole('group', { name: 'Source file' })).toContainText('tour.luau');
  await page.goBack();
  await main.getByRole('link', { name: 'Open encryption' }).click();
  await expect(page).toHaveURL(/\/encrypt$/);
  await page.getByRole('button', { name: 'Use sample' }).click();
  await go(page, 'Main');
  await main.getByRole('link', { name: 'File encryption' }).click();
  await expect(page.getByRole('group', { name: 'Source file' })).toContainText('game-config.luau');
  await expect(toolNav(page).getByRole('link', { name: 'Encryption' })).toHaveCount(0);
  await page.goBack();
  await main.getByRole('link', { name: /^Usages/ }).click();
  await expect(page).toHaveTitle('Usages — ZeoxFucator');
  await page.goBack();
  await main.getByRole('link', { name: /^Dashboard/ }).click();
  await expect(page).toHaveTitle('Dashboard — ZeoxFucator');
});

test('a direct /main link preserves its guide anchor; Help and the finder can return to the guide', async ({
  page,
}) => {
  await page.goto('/main?entry=guide#quick-start');
  await expect(page).toHaveURL(/\/\?entry=guide#quick-start$/);
  const guide = page.getByRole('region', { name: 'How to use ZeoxFucator' });
  await expect(guide).toBeFocused();
  await go(page, 'Usages');
  await page.getByRole('button', { name: 'Search tools' }).click();
  const input = page.getByRole('searchbox', { name: 'Filter tools' });
  await input.fill('Main');
  await input.press('Enter');
  await expect(page).toHaveTitle('Main — ZeoxFucator');
  await toolNav(page).getByRole('button', { name: 'Help' }).click();
  await page
    .getByRole('dialog', { name: 'Workspace guide' })
    .getByRole('link', { name: 'Read the walkthroughs' })
    .click();
  await expect(page).toHaveURL(/\/#quick-start$/);
  await expect(guide).toBeFocused();
});
