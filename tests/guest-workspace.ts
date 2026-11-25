import { test as base, expect, type Page } from '@playwright/test';

// Workspace regressions start in a guest tab by taking the real entry flow.
// Public/entry tests import Playwright directly and start with an empty session.
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByRole('button', { name: 'Continue as guest' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    await use(page);
  },
});
export { expect };
export type { Download, Page } from '@playwright/test';

export async function expectOnlyGuestMarker(page: Page) {
  const storage = await page.evaluate(() => ({
    local: Object.entries(localStorage),
    tab: Object.entries(sessionStorage),
  }));
  expect(storage).toEqual({ local: [], tab: [['zeoxfucator:preview', 'guest']] });
}
