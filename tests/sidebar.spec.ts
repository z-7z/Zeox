import { expect, test } from '@playwright/test';
import { attach } from './attachments';
import { go, toolNav } from './navigation';

test('the desktop sidebar folds in place, preserves its group and labels the mini rail on hover and focus', async ({ page }) => {
  await page.goto('/'); await attach(page, 'kept.lua');
  const nav = toolNav(page), main = page.locator('main'), width = async () => (await main.boundingBox())!.width;
  const initial = await width(), sub = nav.getByRole('list', { name: 'Obfuscator sections' });
  await nav.getByRole('button', { name: 'Hide Obfuscator sections' }).click(); await expect(sub).toBeHidden();
  await nav.getByRole('button', { name: 'Show Obfuscator sections' }).click(); await expect(sub.getByRole('link')).toHaveCount(3);
  await page.getByRole('button', { name: 'Collapse sidebar' }).click();
  await expect(page.getByRole('dialog')).toHaveCount(0); expect(await width()).toBeGreaterThan(initial+100);
  const vault = nav.getByRole('link', { name: 'Vault', exact: true }), hint = page.getByRole('tooltip');
  await expect(vault.locator('.side-label')).toBeHidden(); await expect(sub.getByRole('link')).toHaveCount(3);
  await vault.hover(); await expect(hint).toHaveText('Vault'); await hint.hover(); await expect(hint).toBeVisible();
  await page.keyboard.press('Escape'); await expect(hint).toHaveCount(0);
  const dot = sub.getByRole('link', {name:'Build settings'}); await dot.focus(); await dot.press('Tab');
  await expect(hint).toHaveText('Build output'); await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/obfuscate#build-output$/); await expect(page.getByRole('region', {name:'Build output'})).toBeFocused();
  await go(page, 'Vault'); await expect(page.getByRole('button', {name:'Expand sidebar'})).toBeVisible();
  await go(page, 'Obfuscator'); await expect(page.getByRole('group',{name:'Source file'})).toContainText('kept.lua');
  await page.getByRole('button', { name: 'Expand sidebar' }).click(); expect(await width()).toBe(initial);
});

test('the phone drawer contains focus, dismisses on Escape or backdrop, and releases the page across breakpoints', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 640 }); await page.goto('/vault');
  const opener = page.getByRole('button', { name: 'Expand sidebar' }), drawer = page.getByRole('dialog', { name: 'Workspace menu' });
  await opener.click(); await expect(toolNav(page).getByRole('link', { name: 'Vault', exact:true })).toBeFocused();
  expect(await drawer.evaluate(el => el.matches(':modal'))).toBe(true);
  // The native modal makes the rest of the document inert, without unmounting the tool.
  await page.locator('main').evaluate(el => el.focus()); await expect(toolNav(page).getByRole('link',{name:'Vault',exact:true})).toBeFocused();
  await page.keyboard.press('Tab'); await expect(toolNav(page).getByRole('link',{name:'Usages',exact:true})).toBeFocused();
  await page.keyboard.press('Escape'); await expect(opener).toBeFocused(); await expect(drawer).toHaveCount(0);
  await opener.click(); await page.mouse.click(375,135); await expect(opener).toBeFocused();
  await opener.click(); await page.getByRole('button', { name: 'Collapse sidebar' }).click(); await expect(opener).toBeFocused();
  await opener.click(); await page.setViewportSize({ width: 1280, height: 720 });
  await expect(drawer).toHaveCount(0); await expect(page.getByRole('button', {name:'Collapse sidebar'})).toBeVisible();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe('hidden');
  await go(page, 'Usages'); await expect(page.getByRole('heading',{level:1,name:'Usages'})).toBeVisible();
});

test('the colored shortcuts are real, focusable destinations on cold entry, repeated navigation and browser history', async ({ page }) => {
  await page.setViewportSize({width:390,height:640}); await page.goto('/obfuscate#build-settings');
  const nav = toolNav(page), settings = page.getByRole('region',{name:'Build settings'});
  await expect(settings).toBeFocused(); await expect(settings).toBeInViewport();
  await expect(nav.locator('[aria-current=location]')).toHaveAccessibleName('Build settings');
  await go(page, 'Dashboard'); await page.getByRole('button',{name:'Expand sidebar'}).click();
  await nav.getByRole('link',{name:'Source file',exact:true}).click();
  await expect(page.getByRole('dialog')).toHaveCount(0); await expect(page.getByRole('region',{name:'Source file'})).toBeFocused();
  await nav.getByRole('link',{name:'Build output',exact:true}).click();
  const output = page.getByRole('region',{name:'Build output'}); await expect(output).toBeFocused(); await expect(output).toBeInViewport();
  await nav.getByRole('link',{name:'Build output',exact:true}).click(); await expect(output).toBeFocused();
  await page.goBack(); await expect(nav.locator('[aria-current=location]')).toHaveAccessibleName('Source file');
  await page.reload(); await expect(page.getByRole('region',{name:'Source file'})).toBeFocused();
});
