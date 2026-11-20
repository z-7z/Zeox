import { expect, test, type Page } from '@playwright/test';
import { go, openSidebar } from './navigation';

const sections = ['Dashboard', 'Obfuscate', 'Usages', 'Vault'] as const;
async function pageReady(page: Page, section: typeof sections[number]) {
  await expect(page.locator('main section.ws-panel')).toHaveCount(section === 'Dashboard' ? 7 : section === 'Obfuscate' ? 1 : 3);
  await expect(page.getByRole('banner').getByRole('heading', { level: 1 })).toHaveText(section === 'Dashboard' ? 'Overview' : section);
  await expect(page.locator('h1')).toHaveCount(1); await page.evaluate(() => document.fonts.ready);
}
async function matte(page: Page) {
  return page.locator('.ws-window,.ws-panel,.ws-bar,.ws-rail,.ws-sections a,.ws-drawer,.ws-dialog,.sk-card').evaluateAll(els => els.every(el =>
    [null,'::before','::after'].every(pseudo => { const s = getComputedStyle(el,pseudo); return s.backdropFilter === 'none' && s.boxShadow === 'none' && s.backgroundImage === 'none'; })));
}
for (const [width,height] of [[390,844],[1280,720],[1366,768],[1536,864],[1920,1080],[2560,1440]]) {
  test(`all four routes use the whole viewport and a matte icon rail at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    for (const section of sections) {
      await page.goto('/'+section.toLowerCase()); await pageReady(page,section);
      const geometry = await page.evaluate(() => {
        const rect = (s:string) => document.querySelector(s)!.getBoundingClientRect();
        const shell=rect('.ws-window'),main=rect('main'),content=rect('main > :first-child'),root=document.documentElement;
        return { x:shell.x,y:shell.y, shellWidth:shell.width, shellHeight:shell.height, client:root.clientWidth, scrollWidth:root.scrollWidth,
          left:main.left,right:main.right,contentLeft:content.left,contentRight:content.right };
      });
      expect(geometry.x).toBe(0); expect(geometry.y).toBe(0); expect(geometry.shellWidth).toBe(geometry.client); expect(geometry.scrollWidth).toBe(geometry.client);
      expect(geometry.shellHeight).toBeGreaterThanOrEqual(height); expect(geometry.right).toBe(geometry.client);
      expect(geometry.contentLeft).toBe(geometry.left); expect(geometry.contentRight).toBe(geometry.right);
      if (width >= 1280) {
        expect(geometry.left).toBe(68); expect(geometry.shellHeight).toBeLessThanOrEqual(height+1);
        const available = geometry.right - geometry.left;
        if (section === 'Dashboard' || section === 'Vault') {
          const side = (await page.locator(section === 'Dashboard' ? '.overview-side' : '.vault-side-grid').boundingBox())!;
          const working = (await page.locator(section === 'Dashboard' ? '.trend-plot' : '.vt-drop-button').boundingBox())!;
          expect(side.width).toBeLessThanOrEqual(Math.min(available * .23, 370));
          expect(side.x + side.width).toBeCloseTo(geometry.right, 0);
          expect(working.width).toBeGreaterThan(available * .70); // usable pointer target, not just its containing pane
        } else {
          const details = (await page.locator(section === 'Usages' ? '.usage-mix' : '.src-job-side').boundingBox())!;
          expect(details.width / available).toBeCloseTo(1 / 3.25, 2);
        }
      } else expect(geometry.left).toBe(0);
      expect(await matte(page)).toBe(true); await expect(page.locator('section.ws-panel').first()).toHaveCSS('background-color','rgb(13, 13, 14)');
      const nav = await openSidebar(page); await expect(nav.getByRole('link')).toHaveText(['','','','']); await expect(nav.locator('svg')).toHaveCount(4);
      for (const name of sections) await expect(nav.getByRole('link',{name,exact:true})).toHaveAttribute('title',name);
      await expect(nav.locator('[aria-current=page]')).toHaveAccessibleName(section);
      if (width===390) { await expect(page.getByRole('dialog')).toHaveCSS('backdrop-filter','none'); await page.keyboard.press('Escape'); }
    }
  });
}

test('full screen is optional and explicit, and collapsing the rail reclaims its space', async ({ page }) => {
  await page.goto('/dashboard'); await pageReady(page,'Dashboard'); expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  if (await page.evaluate(() => document.fullscreenEnabled)) {
    await page.getByRole('button',{name:'Enter full screen'}).click(); await expect(page.getByRole('button',{name:'Exit full screen'})).toBeVisible();
    expect(await page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
    await page.getByRole('button',{name:'Exit full screen'}).click(); await expect(page.getByRole('button',{name:'Enter full screen'})).toBeVisible();
  } else await expect(page.getByRole('button',{name:'Enter full screen'})).toHaveCount(0);
  await page.getByRole('button',{name:'Hide sidebar'}).click(); expect((await page.locator('main').boundingBox())!.x).toBe(0);
  await page.getByRole('link',{name:'Obfuscate file'}).click(); expect((await page.locator('main').boundingBox())!.x).toBe(0);
  await go(page,'Dashboard'); await pageReady(page,'Dashboard'); expect(await matte(page)).toBe(true);
});

test('dialogs and tools remain opaque under reduced transparency, with no light sweeps', async ({ page, context }) => {
  const cdp=await context.newCDPSession(page); await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});
  await page.goto('/dashboard'); await page.getByRole('button',{name:'View breakdown'}).click(); expect(await matte(page)).toBe(true);
  await page.keyboard.press('Escape'); await go(page,'Vault'); await page.getByRole('button',{name:'Open studio guide'}).click(); expect(await matte(page)).toBe(true);
  await page.keyboard.press('Escape'); await go(page,'Obfuscate'); await pageReady(page,'Obfuscate'); expect(await matte(page)).toBe(true);
});

test('slow tool entries keep the toolbar and show non-interactive matching panel slots', async ({ page }) => {
  for (const [label, module] of [['Obfuscate', 'Obfuscate'], ['Usages', 'Usages'], ['Vault', 'VaultStudio']]) {
    const chunk = new RegExp(`/(?:src/pages/${module}\\.tsx|assets/${module}-[^/]+\\.js)(?:\\?.*)?$`);
    let release!: () => void; const gate = new Promise<void>(r => { release = r; });
    await page.route(chunk, async route => { await gate; await route.continue(); });
    await page.goto('/' + label.toLowerCase(), { waitUntil: 'commit' });
    let dropWidth = 0;
    try {
      const loading = page.getByRole('status', { name: `Opening ${label}` });
      expect(await matte(page)).toBe(true); await expect(loading.locator('.sk-card')).toHaveCount(label === 'Obfuscate' ? 1 : 3); await expect(loading.getByRole('button')).toHaveCount(0);
      await expect(page.getByRole('heading', { level: 1, name: label })).toBeVisible();
      if (label === 'Vault') dropWidth = (await loading.locator('.vt-drop').boundingBox())!.width;
    } finally { release(); }
    await expect(page.locator('main section.ws-panel')).toHaveCount(label === 'Obfuscate' ? 1 : 3); await page.unroute(chunk);
    if (label === 'Vault') expect((await page.locator('.vt-drop').boundingBox())!.width).toBeCloseTo(dropWidth, 0);
  }
});
