import { expect, type Page } from '@playwright/test';

export const sidebar = (page: Page) => page.getByRole('navigation', { name: 'Workspace sections' });
export async function openSidebar(page: Page) {
  const open = page.getByRole('button', { name: 'Open sidebar' });
  if (await open.isVisible()) await open.click();
  await expect(sidebar(page)).toBeVisible();
  return sidebar(page);
}
export async function go(page: Page, section: string) {
  await (await openSidebar(page)).getByRole('link', { name: section, exact: true }).click();
}
