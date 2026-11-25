import { expect, test, type Locator, type Page } from '@playwright/test';
import { attach } from './attachments';
import { go, toolNav } from './navigation';

async function expectPublic(page: Page) {
  await expect(page.getByRole('navigation', { name: 'Tools', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Search tools' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Session activity' })).toHaveCount(0);
  await expect(page.locator('.orbit-app, .dock, .topbar, input[type=file]')).toHaveCount(0);
}
async function readImage(img: Locator) {
  await img.scrollIntoViewIfNeeded();
  return img.evaluate(async (el: HTMLImageElement) => {
    await el.decode();
    return { local: new URL(el.currentSrc).origin === location.origin, width: el.naturalWidth, src: el.currentSrc };
  });
}

for (const width of [320, 1440]) {
  test(`public landing → independent login → guest Dashboard at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page).toHaveTitle('Main — ZeoxFucator');
    await expect(page.getByRole('heading', { level: 1, name: /Lua tools/ })).toBeVisible();
    await expectPublic(page);
    await expect(
      page.locator('a[href="/dashboard"], a[href="/obfuscate"], a[href="/encrypt"], a[href="/usages"]'),
    ).toHaveCount(0);
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
    await page.getByRole('link', { name: width === 320 ? 'Log in' : 'Get started', exact: true }).click();
    await expect(page).toHaveURL(/\/login$/);
    await expect(page).toHaveTitle('Log in — ZeoxFucator');
    await expectPublic(page);
    await expect(page.getByRole('main')).toBeFocused();
    await expect(page.locator('input')).toHaveCount(0);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
    await page.getByRole('button', { name: 'Continue as guest' }).press('Enter');
    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('main')).toBeFocused();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard');
    await expect(toolNav(page).getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page');
    await expect(toolNav(page).getByRole('link', { name: 'Main' })).toHaveCount(0);
    await expect(toolNav(page).getByRole('link', { name: 'Encryption' })).toHaveCount(0);
    await expect(page.getByRole('button', { name: 'Light mode: switch to dark' })).toBeVisible();
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard');
  });
}

test('public guides have local, theme-matched images, keyboard selection, FAQ and deep links', async ({ page }) => {
  await page.goto('/main?entry=guide#quick-start');
  await expect(page).toHaveURL(/\/\?entry=guide#quick-start$/);
  const guide = page.getByRole('region', { name: /How it works/ });
  await expect(guide).toBeFocused();
  await expectPublic(page);
  expect((await readImage(page.getByRole('img', { name: /orbital sculpture/ }))).local).toBe(true);
  const image = guide.getByRole('img');
  const source = await readImage(image);
  expect(source.width).toBeGreaterThan(0);
  await expect(guide).toContainText('512 KiB max');
  const archive = guide.getByRole('button', { name: 'File archive' });
  await archive.press('Space');
  await expect(archive).toHaveAttribute('aria-pressed', 'true');
  await expect(guide).toContainText('25 MB max');
  const dark = await readImage(image);
  expect(dark.local).toBe(true);
  expect(dark.src).not.toBe(source.src);
  await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
  expect((await readImage(image)).src).not.toBe(dark.src);
  await page.getByRole('link', { name: 'FAQ', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Questions?' })).toBeFocused();
  await page.getByText('Do my files leave my device?', { exact: true }).press('Enter');
  await expect(page.getByText(/The browser reads and processes the file locally/)).toBeVisible();
});

test('cold workspace links stop at login; a known tool bookmark resumes with its search and hash', async ({ page }) => {
  for (const route of ['/dashboard', '/usages', '/vault', '/showcase', '/?from=bookmark#build-settings']) {
    await page.goto(route);
    await expect(page).toHaveURL(/\/login$/);
    await expectPublic(page);
  }
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await expect(page).toHaveURL(/\/obfuscate\?from=bookmark#build-settings$/);
  await expect(page.getByRole('region', { name: 'Build configuration' })).toBeFocused();
});

test('a guest can revisit the public site; ending the preview discards files, history and the guest marker', async ({
  page,
}) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await go(page, 'Obfuscator');
  await attach(page, 'session-only.luau');
  await page.getByRole('button', { name: 'Obfuscate file' }).click();
  await page.getByRole('link', { name: 'ZeoxFucator home' }).click();
  await expectPublic(page);
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await go(page, 'Obfuscator');
  await expect(page.getByRole('link', { name: 'Download file' })).toHaveAttribute('download', 'session-only.obf.luau');
  await page.getByRole('button', { name: 'Local workspace information' }).click();
  await page.getByRole('button', { name: 'End guest session' }).click();
  await expect(page).toHaveURL(/\/$/);
  await expectPublic(page);
  expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
  await page.goBack();
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await go(page, 'Obfuscator');
  await expect(page.getByRole('group', { name: 'Source file' })).not.toContainText('session-only');
  await expect(page.locator('a[download]')).toHaveCount(0);
  await go(page, 'Usages');
  await expect(page.getByText('No usage yet')).toBeVisible();
});

test('guest preview also works in memory when the browser denies session storage', async ({ page }) => {
  await page.addInitScript(() =>
    Object.defineProperty(window, 'sessionStorage', {
      get() {
        throw new DOMException('Storage disabled', 'SecurityError');
      },
    }),
  );
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByRole('button', { name: 'Continue as guest' }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard');
  await page.reload();
  await expect(page).toHaveURL(/\/login$/);
});
