import { expect, test, type Locator, type Page } from '@playwright/test';
import { attach, downloadOutput } from './attachments';
import { go, toolNav } from './navigation';

const exampleSource = '-- A short greeting\nlocal   message = "Hi"\n\nreturn   message';
const exampleOutput = 'local message = "\\072\\105"\nreturn message';

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
    await attach(page, 'greeting.luau', exampleSource);
    await page.getByRole('button', { name: 'Obfuscate file' }).click();
    expect(await downloadOutput(page)).toEqual({
      name: 'greeting.obf.luau',
      bytes: Buffer.from(exampleOutput),
    });
  });
}

test('Main uses the original public colors in both themes', async ({ page }) => {
  await page.goto('/');
  for (const [theme, background, accent, button, card] of [
    ['dark', 'rgb(12, 12, 15)', 'rgb(210, 186, 255)', 'rgb(222, 204, 255)', 'rgb(0, 0, 0)'],
    ['light', 'rgb(251, 250, 251)', 'rgb(102, 66, 132)', 'rgb(51, 34, 63)', 'rgb(255, 255, 255)'],
  ]) {
    if (theme === 'light') await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
    await expect(page.locator('.public-site')).toHaveCSS('background-color', background);
    await expect(page.locator('#landing-title em')).toHaveCSS('color', accent);
    await expect(page.getByRole('link', { name: 'Obfuscate a script' })).toHaveCSS('background-color', button);
    await expect(page.locator('.example-bench')).toHaveCSS('background-color', card);
    await expect(page.locator('#example-output .lua-string')).toHaveCSS('color', accent);
  }
});

test.describe('public live example', () => {
  test.use({ hasTouch: true, viewport: { width: 390, height: 844 } });

  test('a sample can be changed with touch or a keyboard, offline and without entering the workspace', async ({
    page,
    context,
  }) => {
    await page.goto('/#live-example', { waitUntil: 'networkidle' });
    const demo = page.getByRole('region', { name: 'Live example' });
    await expect(demo).toBeFocused();
    await expectPublic(page);
    await context.setOffline(true);
    const input = demo.getByRole('figure', { name: 'Input: greeting.luau' }).locator('code');
    const result = demo.getByRole('figure', { name: /^Output:/ });
    const toggles = demo.getByRole('group', { name: 'Example transforms' });
    const encode = toggles.getByRole('button', { name: 'Encode text literals' });
    await expect(input).toHaveJSProperty('textContent', exampleSource);
    await expect(result.locator('code')).toHaveJSProperty('textContent', exampleOutput);
    await expect(encode).toHaveAttribute('aria-pressed', 'true');
    await encode.tap();
    await expect(encode).toHaveAttribute('aria-pressed', 'false');
    await expect(result).toHaveAccessibleName('Output: greeting.compact.luau');
    await expect(result.locator('code')).toHaveJSProperty('textContent', 'local message = "Hi"\nreturn message');
    await toggles.getByRole('button', { name: 'Remove comments' }).press('Space');
    await expect(result.locator('code')).toHaveJSProperty(
      'textContent',
      '-- A short greeting\nlocal message = "Hi"\nreturn message',
    );
    await toggles.getByRole('button', { name: 'Compact spacing' }).tap();
    await expect(result.locator('code')).toHaveJSProperty('textContent', exampleSource);
    await expect(demo.getByRole('status')).toContainText(
      `0 of 3 on. Example output: ${Buffer.byteLength(exampleSource)} bytes.`,
    );
    await expect(input).toHaveJSProperty('textContent', exampleSource);
    await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
    await expect(result.locator('code')).toHaveJSProperty('textContent', exampleSource);
    await expect(page.locator('a[download], input, textarea, [contenteditable="true"]')).toHaveCount(0);
    expect(await page.evaluate(() => [localStorage.length, sessionStorage.length])).toEqual([0, 0]);
    await expect(page).toHaveURL(/\/#live-example$/);
  });
});

test('the longest sample output fits on phones and at the split-pane breakpoint', async ({ page }) => {
  await page.goto('/#live-example');
  const demo = page.getByRole('region', { name: 'Live example' });
  await demo.getByRole('button', { name: 'Compact spacing' }).click();
  for (const width of [320, 390, 571, 640, 641, 768]) {
    await page.setViewportSize({ width, height: 620 });
    const fits = await demo.locator('pre').evaluateAll(
      (nodes) =>
        nodes.every((node) => {
          const style = getComputedStyle(node);
          const lines = node.textContent!.split('\n').length;
          return (
            node.scrollWidth <= node.clientWidth &&
            node.getBoundingClientRect().height <= lines * parseFloat(style.lineHeight) + 1
          );
        }) && document.documentElement.scrollWidth === document.documentElement.clientWidth,
    );
    expect(fits, `readable code at ${width}px`).toBe(true);
  }
});

test('all three guide illustrations follow the theme and the guide and FAQ keep their keyboard destinations', async ({
  page,
}) => {
  await page.goto('/main?entry=guide#quick-start');
  await expect(page).toHaveURL(/\/\?entry=guide#quick-start$/);
  const guide = page.getByRole('region', { name: 'How it works', exact: true });
  await expect(guide).toBeFocused();
  await expectPublic(page);
  await expect(guide).toContainText('512 KiB max');
  await expect(guide.getByRole('listitem')).toHaveCount(3);
  await expect(guide).not.toContainText(/archive|passphrase|file studio/i);
  const images = guide.getByRole('img');
  await expect(images).toHaveCount(3);
  const dark: string[] = [];
  for (const img of await images.all()) {
    const picture = await readImage(img);
    expect(picture.local).toBe(true);
    expect(picture.width).toBeGreaterThan(0);
    dark.push(picture.src);
  }
  expect(new Set(dark).size).toBe(3);
  await page.getByRole('button', { name: 'Dark mode: switch to light' }).click();
  for (const [i, img] of (await images.all()).entries()) {
    const light = await readImage(img);
    expect(light.local).toBe(true);
    expect(light.width).toBeGreaterThan(0);
    expect(light.src).not.toBe(dark[i]);
  }
  await page.getByRole('link', { name: 'Live example', exact: true }).press('Enter');
  await expect(page.getByRole('region', { name: 'Live example' })).toBeFocused();
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
  await page.getByRole('button', { name: 'Encode text literals' }).click();
  await page.getByRole('link', { name: 'Dashboard', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Script builds' }).locator('strong')).toHaveText('1');
  await go(page, 'Obfuscator');
  await expect(page.getByRole('switch', { name: 'Encode text literals' })).toBeChecked();
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
