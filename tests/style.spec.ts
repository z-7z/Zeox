import { expect, test, type Page } from '@playwright/test';
import { destinations, go, openSettings, toolNav } from './navigation';

type Label = typeof destinations[number]['label'];
const slots = (section: Label) => section === 'Dashboard' ? 8 : section === 'Obfuscator' ? 3 : 5;
async function pageReady(page: Page, section: Label) {
  await expect(page.locator('main section.ws-panel')).toHaveCount(slots(section));
  await expect(page.getByRole('heading', { level: 1, name: destinations.find(d => d.label === section)!.heading, exact: true })).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1); await page.evaluate(() => document.fonts.ready);
}
async function matte(page: Page) {
  return page.locator('.ws-window,.ws-panel,.ws-bar,.side-item,.side-surface,.ws-dialog,.sk-card').evaluateAll(els => els.every(el =>
    [null,'::before','::after'].every(pseudo => { const s = getComputedStyle(el,pseudo); return s.backdropFilter === 'none' && s.boxShadow === 'none' && s.animationName === 'none'; })));
}
for (const [width,height] of [[390,844],[1280,720],[1366,768],[1536,864],[1920,1080],[2560,1440]]) {
  test(`four routes fill the column beside a single matte sidebar at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    for (const { label, path } of destinations) {
      await page.goto(path); await pageReady(page,label);
      const geometry = await page.evaluate(() => {
        const rect = (s:string) => document.querySelector(s)!.getBoundingClientRect();
        const shell=rect('.ws-window'),main=rect('main'),content=rect('main > :first-child'),root=document.documentElement;
        return { x:shell.x,y:shell.y, shellWidth:shell.width, shellHeight:shell.height, client:root.clientWidth, scrollWidth:root.scrollWidth, side:rect('.side-slot').right,
          left:main.left,right:main.right,contentLeft:content.left,contentRight:content.right };
      });
      expect(geometry.x).toBe(0); expect(geometry.y).toBe(0); expect(geometry.shellWidth).toBe(geometry.client); expect(geometry.scrollWidth).toBe(geometry.client);
      expect(geometry.shellHeight).toBeGreaterThanOrEqual(height); expect(geometry.side).toBeGreaterThan(44); expect(geometry.left).toBe(geometry.side); expect(geometry.right).toBe(geometry.client);
      expect(geometry.contentLeft-geometry.left).toBeGreaterThanOrEqual(9); expect(geometry.right - geometry.contentRight).toBeCloseTo(geometry.contentLeft-geometry.left,0);
      if (width >= 1280) expect(geometry.shellHeight).toBeLessThanOrEqual(height+1);
      await expect.poll(() => matte(page)).toBe(true);
      await expect(page.locator('section.ws-panel').first()).toHaveCSS('background-color','rgb(18, 18, 19)');
      await expect(page.locator('main .mint-card')).toHaveCount(label === 'Obfuscator' ? 0 : 1);
      const nav = toolNav(page); await expect(nav).toHaveCount(1); await expect(nav.getByRole('link')).toHaveCount(7);
      for (const d of destinations) await expect(nav.getByRole('link',{name:d.label,exact:true})).toHaveAttribute('href',d.path);
      await expect(nav.locator('[aria-current=page]')).toHaveAccessibleName(label);
    }
  });
}

test('full screen is explicit and available from session preferences without changing routes', async ({ page }) => {
  await page.goto('/dashboard'); await pageReady(page,'Dashboard'); expect(await page.evaluate(() => !!document.fullscreenElement)).toBe(false);
  await openSettings(page);
  if (await page.evaluate(() => document.fullscreenEnabled)) {
    await page.getByRole('button',{name:'Enter full screen'}).click(); await expect(page.getByRole('button',{name:'Exit full screen'})).toBeVisible();
    expect(await page.evaluate(() => document.fullscreenElement === document.documentElement)).toBe(true);
    await page.getByRole('button',{name:'Exit full screen'}).click(); await expect(page.getByRole('button',{name:'Enter full screen'})).toBeVisible();
  } else await expect(page.getByRole('button',{name:'Enter full screen'})).toHaveCount(0);
  await page.keyboard.press('Escape'); await page.getByRole('link',{name:'Obfuscate file'}).click(); await pageReady(page,'Obfuscator');
  await go(page,'Dashboard'); await pageReady(page,'Dashboard'); await expect.poll(() => matte(page)).toBe(true);
});

test('dialogs and tools remain opaque under reduced transparency, with no light sweeps', async ({ page, context }) => {
  const cdp=await context.newCDPSession(page); await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-transparency',value:'reduce'}]});
  await page.goto('/dashboard'); await page.getByRole('button',{name:'View breakdown'}).click(); await expect.poll(() => matte(page)).toBe(true);
  await page.keyboard.press('Escape'); await go(page,'Vault'); await page.getByRole('button',{name:'Open studio guide'}).click(); await expect.poll(() => matte(page)).toBe(true);
  await page.keyboard.press('Escape'); await go(page,'Obfuscator'); await pageReady(page,'Obfuscator'); await expect.poll(() => matte(page)).toBe(true);
});

for (const [width,height] of [[390,844], [1366,768]]) {
  test(`cold entries, including the home URL, reserve the actual tool slots at ${width}×${height}`, async ({ page }) => {
    await page.setViewportSize({width,height});
    const boxes = () => page.locator('main > div > .ws-panel').evaluateAll(els => els.map(el => {
      const {x,y,width:w,height:h} = el.getBoundingClientRect(); return [x,y,w,h].map(Math.round);
    }));
    for (const [label,module,path] of [['Obfuscator','Obfuscate','/'],['Usages','Usages','/usages'],['Vault','VaultStudio','/vault']] as const) {
      const chunk = new RegExp(`/(?:src/pages/${module}\\.tsx|assets/${module}-[^/]+\\.js)(?:\\?.*)?$`);
      let release!: () => void; const gate = new Promise<void>(resolve => { release = resolve; });
      await page.route(chunk, async route => { await gate; await route.continue(); });
      await page.goto(path, {waitUntil:'commit'}); let cold: number[][];
      try {
        const loading = page.getByRole('status', {name:`Opening ${label}`});
        await expect(loading.locator('.sk-card')).toHaveCount(slots(label)); await expect(loading.getByRole('button')).toHaveCount(0);
        await expect(page.getByRole('heading',{level:1,name:label === 'Obfuscator' ? 'Lua Obfuscator' : label})).toBeVisible();
        await page.evaluate(() => document.fonts.ready); await expect.poll(() => matte(page)).toBe(true); cold = await boxes();
      } finally { release(); }
      await pageReady(page,label); expect(await boxes()).toEqual(cold); await page.unroute(chunk);
    }
  });
}
