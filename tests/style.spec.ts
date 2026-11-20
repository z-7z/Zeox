import { expect, test, type Page } from '@playwright/test';
import { go } from './navigation';

const sections = ['Dashboard', 'Obfuscate', 'Usages', 'Vault'] as const;
async function appearance(page: Page, section: typeof sections[number]) {
  await expect(page.getByRole('banner').getByRole('heading', { level: 1 })).toHaveText(section === 'Dashboard' ? 'Overview' : section);
  await expect(page.locator('h1')).toHaveCount(1);
  const cards = page.locator('main section.glass-card'); await expect(cards).toHaveCount(section === 'Dashboard' ? 6 : section === 'Obfuscate' ? 1 : 3);
  return cards.evaluateAll(els => {
    const css = (selector: string) => getComputedStyle(document.querySelector(selector)!);
    const title = css('h1'), main = css('main'), canvas = css('.ws-window');
    const bounds = els[0].getBoundingClientRect();
    const head = document.querySelector('.panel-head h2'), frame = document.querySelector('main')!.getBoundingClientRect();
    return { frame: [canvas.background, main.padding, title.font], widgetType: head && [getComputedStyle(head).font, getComputedStyle(head).color],
      centered: Math.abs((bounds.left + bounds.right) - (frame.left + frame.right)) < 2,
      start: [bounds.x, bounds.y, bounds.width].map(Math.round),
      surfaces: els.map(el => {
        const style = getComputedStyle(el), corners = getComputedStyle(el, '::after');
        return { fill: style.background, edge: style.border, radius: style.borderRadius, shadow: style.boxShadow, blur: style.backdropFilter, marks: corners.maskImage };
      }) };
  });
}

for (const width of [390, 1440]) {
  test(`direct tool entries and tab switches keep the Dashboard material and alignment at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto('/dashboard'); const reference = await appearance(page, 'Dashboard');
    const surface = reference.surfaces[0]; expect(surface.radius).toBe('8px'); expect(surface.marks).not.toBe('none');
    for (const section of sections.slice(1)) {
      // A full navigation deliberately drops all previously loaded route CSS.
      await page.goto('/' + section.toLowerCase()); const tool = await appearance(page, section);
      expect(tool.frame).toEqual(reference.frame);
      if (section === 'Obfuscate') expect(tool.centered).toBe(true); // One centered file job, not a pair of editor panels.
      else { expect(tool.start).toEqual(reference.start); expect(tool.widgetType).toEqual(reference.widgetType); }
      tool.surfaces.forEach(style => expect(style).toEqual(surface));
    }
    await go(page, 'Usages'); await go(page, 'Obfuscate'); await go(page, 'Dashboard');
    expect(await appearance(page, 'Dashboard')).toEqual(reference);
  });
}

test('all sections use opaque graphite panels with reduced transparency', async ({ page, context }) => {
  const cdp = await context.newCDPSession(page);
  await cdp.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-transparency', value: 'reduce' }] });
  for (const section of sections) {
    await page.goto('/' + section.toLowerCase()); const { surfaces } = await appearance(page, section);
    for (const s of surfaces) { expect(s.blur).toBe('none'); expect(s.fill).toContain('rgb(15, 15, 15)'); expect(s.fill).not.toContain('gradient'); }
  }
});

test('slow tool entries keep the toolbar and show non-interactive matching panel slots', async ({ page }) => {
  for (const [label, module] of [['Obfuscate', 'Obfuscate'], ['Usages', 'Usages'], ['Vault', 'VaultStudio']]) {
    const chunk = new RegExp(`/(?:src/pages/${module}\\.tsx|assets/${module}-[^/]+\\.js)(?:\\?.*)?$`);
    let release!: () => void; const gate = new Promise<void>(r => { release = r; });
    await page.route(chunk, async route => { await gate; await route.continue(); });
    await page.goto('/' + label.toLowerCase(), { waitUntil: 'commit' });
    try {
      const loading = page.getByRole('status', { name: `Opening ${label}` });
      await expect(loading.locator('.sk-card')).toHaveCount(label === 'Obfuscate' ? 1 : 3); await expect(loading.getByRole('button')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1, name: label })).toBeVisible();
    } finally { release(); }
    await expect(page.locator('main section.glass-card')).toHaveCount(label === 'Obfuscate' ? 1 : 3); await page.unroute(chunk);
  }
});
