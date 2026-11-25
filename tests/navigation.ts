import { expect, type Page } from '@playwright/test';

export const destinations = [
  { label: 'Obfuscator', path: '/obfuscate', heading: 'Lua Obfuscator' },
  { label: 'Usages', path: '/usages', heading: 'Usages' },
  { label: 'Dashboard', path: '/dashboard', heading: 'Dashboard' },
] as const;
export const toolNav = (page: Page) => page.getByRole('navigation', { name: 'Tools' });
export async function go(page: Page, section: (typeof destinations)[number]['label'] | 'Encryption') {
  if (section === 'Encryption') {
    // This standalone page is searchable, not a permanent navigation item.
    await page.getByRole('button', { name: 'Search tools' }).click();
    await page
      .getByRole('dialog', { name: 'Find a tool' })
      .getByRole('link', { name: /^Encryption\b/ })
      .click();
  } else {
    await toolNav(page).getByRole('link', { name: section, exact: true }).click();
  }
}

// Assert geometry and hit targets, not just the class or media query names.
export async function expectToolsAt(page: Page, placement: 'left' | 'bottom') {
  const nav = toolNav(page);
  await expect(nav.locator('a[href="/encrypt"], a[href="/"], a[href="/login"]')).toHaveCount(0);
  const geometry = await nav.evaluate((el) => {
    const row = el.querySelector('.dock-items')!.getBoundingClientRect();
    const buttons = Array.from(el.querySelectorAll('a, button')).map((item) => {
      const { left, right, top, bottom } = item.getBoundingClientRect();
      const hit = document.elementFromPoint((left + right) / 2, (top + bottom) / 2);
      return { left, right, top, bottom, reachable: item.contains(hit) };
    });
    return {
      buttons,
      rowStart: row.left,
      rowEnd: row.right,
      bottom: el.getBoundingClientRect().bottom,
      height: innerHeight,
      main: document.querySelector('main')!.getBoundingClientRect().left,
    };
  });
  expect(geometry.buttons).toHaveLength(destinations.length + 1); // Page links, plus Help.
  expect(geometry.buttons.every((b) => b.reachable)).toBe(true);
  if (placement === 'bottom') {
    expect(Math.abs(geometry.bottom - geometry.height)).toBeLessThan(1);
    expect(geometry.buttons[0].left).toBeCloseTo(geometry.rowStart, 0);
    expect(geometry.buttons[geometry.buttons.length - 1].right).toBeCloseTo(geometry.rowEnd, 0);
  }
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
