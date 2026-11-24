import { expect, type Page } from '@playwright/test';

export const destinations = [
  { label: 'Obfuscator', path: '/obfuscate', heading: 'Lua Obfuscator' },
  { label: 'Vault', path: '/vault', heading: 'Vault' },
  { label: 'Usages', path: '/usages', heading: 'Usages' },
  { label: 'Dashboard', path: '/dashboard', heading: 'Overview' },
] as const;
export const toolNav = (page: Page) => page.getByRole('navigation', { name: 'Workspace sections' });
export async function openTools(page: Page) {
  const nav = toolNav(page);
  if (!await nav.isVisible()) await page.getByRole('button', { name: 'Open tools', exact: true }).click();
  await expect(nav).toBeVisible(); return nav;
}
export async function go(page: Page, section: typeof destinations[number]['label']) {
  await (await openTools(page)).getByRole('link', { name: section, exact: true }).click();
}
export const openSession = (page: Page) => page.getByRole('button', { name: 'Local session information' }).click();
