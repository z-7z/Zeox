import type { Page } from '@playwright/test';

export const destinations = [
  { label: 'Obfuscator', path: '/obfuscate', heading: 'Lua Obfuscator' },
  { label: 'Vault', path: '/vault', heading: 'Vault' },
  { label: 'Usages', path: '/usages', heading: 'Usages' },
  { label: 'Dashboard', path: '/dashboard', heading: 'Overview' },
] as const;
export const toolNav = (page: Page) => page.getByRole('navigation', { name: 'Workspace sections' });
export const go = (page: Page, section: typeof destinations[number]['label']) =>
  toolNav(page).getByRole('link', { name: section, exact: true }).click();
export const openSettings = (page: Page) => page.getByRole('button', { name: 'Settings', exact: true }).click();
