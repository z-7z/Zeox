import { expect, test, type Page } from '@playwright/test';
import { go, openSidebar } from './navigation';

const sections = ['Dashboard', 'Obfuscate', 'Usages', 'Vault'] as const;
async function pageReady(page: Page, section: typeof sections[number]) {
  await expect(page.locator('main section.ws-panel')).toHaveCount(section === 'Dashboard' ? 8 : 5);
  await expect(page.getByRole('banner').getByRole('heading', { level: 1 })).toHaveText(section === 'Dashboard' ? 'Overview' : section);
  await expect(page.locator('h1')).toHaveCount(1); await page.evaluate(() => document.fonts.ready);
}
async function matte(page: Page) {
  return page.locator('.ws-window,.ws-panel,.ws-bar,.ws-rail,.ws-sections a,.ws-drawer,.ws-dialog,.sk-card').evaluateAll(els => els.every(el =>
    [null,'::before','::after'].every(pseudo => { const s = getComputedStyle(el,pseudo); return s.backdropFilter === 'none' && s.boxShadow === 'none' && s.animationName === 'none'; })));
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
      const inset = geometry.contentLeft - geometry.left;
      expect(inset).toBeGreaterThanOrEqual(9); expect(geometry.right - geometry.contentRight).toBeCloseTo(inset,0);
      if (width >= 1280) {
        expect(geometry.left).toBeCloseTo(Math.min(112,width*.0755),0); expect(geometry.shellHeight).toBeLessThanOrEqual(height+1);
      } else expect(geometry.left).toBe(0);
      await expect.poll(() => matte(page)).toBe(true);
      await expect(page.locator('section.ws-panel').first()).toHaveCSS('background-color','rgb(18, 18, 19)');
      await expect(page.locator('main .mint-card')).toHaveCount(1);
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
  await go(page,'Dashboard'); await pageReady(page,'Dashboard'); await expect.poll(() => matte(page)).toBe(true);
});

test('dialogs and tools remain opaque under reduced transparency, with no light sweeps', async ({ page, context }) => {
  const cdp=await context.newCDPSession(page); await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});
  await page.goto('/dashboard'); await page.getByRole('button',{name:'View breakdown'}).click(); await expect.poll(() => matte(page)).toBe(true);
  await page.keyboard.press('Escape'); await go(page,'Vault'); await page.getByRole('button',{name:'Open studio guide'}).click(); await expect.poll(() => matte(page)).toBe(true);
  await page.keyboard.press('Escape'); await go(page,'Obfuscate'); await pageReady(page,'Obfuscate'); await expect.poll(() => matte(page)).toBe(true);
});

for (const [width,height] of [[390,844], [1366,768]]) {
  test(`cold tool entries reserve the five live card slots at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    const boxes = () => page.locator('main > div > .ws-panel').evaluateAll(els => els.map(el => {
      const {x,y,width:w,height:h} = el.getBoundingClientRect(); return [x,y,w,h].map(Math.round);
    }));
    for (const [label,module] of [['Obfuscate','Obfuscate'],['Usages','Usages'],['Vault','VaultStudio']]) {
      const chunk = new RegExp(`/(?:src/pages/${module}\\.tsx|assets/${module}-[^/]+\\.js)(?:\\?.*)?$`);
      let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
      await page.route(chunk, async route => { await gate; await route.continue(); });
      await page.goto('/'+label.toLowerCase(), {waitUntil:'commit'}); let cold: number[][];
      try {
        const loading = page.getByRole('status', {name:`Opening ${label}`});
        await expect(loading.locator('.sk-card')).toHaveCount(5); await expect(loading.getByRole('button')).toHaveCount(0);
        await expect(page.getByRole('heading',{level:1,name:label})).toBeVisible(); await expect.poll(() => matte(page)).toBe(true);
        cold = await boxes();
      } finally { release(); }
      await expect(page.locator('main section.ws-panel')).toHaveCount(5); await page.evaluate(() => document.fonts.ready);
      expect(await boxes()).toEqual(cold); await page.unroute(chunk);
    }
  });
}
