import { expect, type Page } from '@playwright/test';

export const destinations = [
  { label: 'Obfuscator', path: '/obfuscate', heading: 'Lua Obfuscator' },
  { label: 'Vault', path: '/vault', heading: 'Vault' },
  { label: 'Usages', path: '/usages', heading: 'Usages' },
  { label: 'Dashboard', path: '/dashboard', heading: 'Dashboard' },
] as const;
export const toolNav = (page: Page) => page.getByRole('navigation', { name: 'Tools' });
export const go = (page: Page, section: (typeof destinations)[number]['label']) =>
  toolNav(page).getByRole('link', { name: section, exact: true }).click();

// Assert geometry and hit targets, not just the class or media query names.
export async function expectToolsAt(page: Page, placement: 'left' | 'bottom') {
  const nav = toolNav(page);
  const geometry = await nav.evaluate((el) => {
    const buttons = Array.from(el.querySelectorAll('a, button')).map((item) => {
      const { left, right, top, bottom } = item.getBoundingClientRect();
      const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
      return { left, right, top, bottom, reachable: item.contains(hit) };
    });
    return {
      buttons,
      bottom: el.getBoundingClientRect().bottom,
      height: innerHeight,
      main: document.querySelector('main')!.getBoundingClientRect().left,
    };
  });
  expect(geometry.buttons).toHaveLength(destinations.length + 1); // Four routes, plus Help.
  expect(geometry.buttons.every((b) => b.reachable)).toBe(true);
  if (placement === 'bottom') expect(Math.abs(geometry.bottom - geometry.height)).toBeLessThan(1);
  for (const [i, item] of geometry.buttons.entries()) {
    if (placement === 'bottom') {
      expect(item.top).toBeCloseTo(geometry.buttons[0].top, 0);
      if (i) expect(item.left).toBeGreaterThanOrEqual(geometry.buttons[i - 1].right - 1);
    } else {
      expect(item.right).toBeLessThanOrEqual(geometry.main);
      expect(item.left).toBeCloseTo(geometry.buttons[0].left, 0);
      if (i) expect(item.top).toBeGreaterThanOrEqual(geometry.buttons[i - 1].bottom);
    }
  }
}
