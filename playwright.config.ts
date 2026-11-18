import { defineConfig } from '@playwright/test';

// Minimal Linux images default to ASCII; Chromium then discards Unicode download names.
if (process.platform === 'linux' && !process.env.LC_ALL && (!process.env.LANG || /^(C|POSIX)$/.test(process.env.LANG))) {
  process.env.LANG = 'C.UTF-8';
}

export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: 'http://127.0.0.1:5173',
    viewport: { width: 1440, height: 900 },
    launchOptions: { executablePath: process.env.CHROMIUM_PATH },
  },
  webServer: {
    command: 'npm run dev -- --port 5173 --strictPort',
    url: 'http://127.0.0.1:5173/dashboard',
    reuseExistingServer: !process.env.CI,
  },
});
