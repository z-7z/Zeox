import { expect, test, type Locator, type Page } from '@playwright/test';
import { attach, downloadOutput } from './attachments';
import { go, toolNav } from './navigation';

async function expectPublic(page: Page) {
  await expect(page.getByRole('navigation', { name: 'Workspace', exact: true })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Search workspace' })).toHaveCount(0);
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
  test(`Lua Obfuscator landing → guest Dashboard → downloadable script at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto('/');
    await expect(page).toHaveTitle('Lua Obfuscator — ZeoxFucator');
    await expect(page.getByRole('heading', { level: 1, name: 'Lua Obfuscator', exact: true })).toBeVisible();
    await expectPublic(page);
    await expect(
      page.locator('a[href="/dashboard"], a[href="/obfuscate"], a[href="/encrypt"], a[href="/usages"]'),
    ).toHaveCount(0);
    await page.keyboard.press('Control+k');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
    await page.getByRole('link', { name: width === 320 ? 'Log in' : 'Obfuscate a script', exact: true }).click();
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
    const start = page.getByRole('link', { name: 'Obfuscate a script', exact: true });
    await expect(start).toBeInViewport();
    await expect(start).toHaveAttribute('href', '/obfuscate');
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Dashboard');
    await start.press('Enter');
    await expect(page).toHaveURL(/\/obfuscate$/);
    await attach(page, 'greeting.luau', '-- Greeting\nlocal  msg = "Hi"\nreturn msg');
    await page.getByRole('button', { name: 'Obfuscate file' }).click();
    expect(await downloadOutput(page)).toEqual({
      name: 'greeting.obf.luau',
      bytes: Buffer.from('local msg = "\\072\\105"\nreturn msg'),
    });
  });
}

test('public guide shows the real source pass, themed settings picture and keyboard-accessible FAQ', async ({
  page,
}) => {
  await page.goto('/main?entry=guide#quick-start');
  await expect(page).toHaveURL(/\/\?entry=guide#quick-start$/);
  const guide = page.getByRole('region', { name: /How it works/ });
  await expect(guide).toBeFocused();
  await expectPublic(page);
  const example = page.getByRole('figure', { name: /before and after/ });
  expect((await readImage(example.locator('img'))).local).toBe(true);
  await expect(example.locator('pre')).toHaveText(
    ['-- Greeting\nlocal  msg = "Hi"\nreturn msg', 'local msg = "\\072\\105"\nreturn msg'],
    { useInnerText: true },
  );
  const image = guide.getByRole('img', { name: /build settings/ });
  const dark = await readImage(image);
  expect(dark.local).toBe(true);
  expect(dark.width).toBeGreaterThan(0);
  await expect(guide).toContainText('512 KiB max');
  await expect(guide.getByRole('listitem')).toHaveCount(3);
  await expect(guide).not.toContainText(/archive|passphrase|file studio/i);
  await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
  const light = await readImage(image);
  expect(light.local).toBe(true);
  expect(light.src).not.toBe(dark.src);
  await page.getByRole('link', { name: 'FAQ', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Questions?' })).toBeFocused();
  await page.getByText('Is my script uploaded or executed?', { exact: true }).press('Enter');
  await expect(page.getByText(/never sends your source to a server or runs it/)).toBeVisible();
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
