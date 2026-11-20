import type { Page } from '@playwright/test';

export function attach(page: Page, name = 'settings.luau', contents: string | Buffer = 'return "Orbit"') {
  return page.getByLabel('Attach Lua or Luau file').setInputFiles({ name, mimeType: 'application/octet-stream', buffer: Buffer.isBuffer(contents) ? contents : Buffer.from(contents) });
}

export async function downloadOutput(page: Page) {
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('link', { name: 'Download file' }).click()]);
  const bytes = []; for await (const chunk of (await download.createReadStream())!) bytes.push(chunk);
  return { name: download.suggestedFilename(), bytes: Buffer.concat(bytes) };
}
