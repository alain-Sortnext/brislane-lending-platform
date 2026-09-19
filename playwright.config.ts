import { defineConfig, devices } from '@playwright/test';

// TODO: env-aware config (DEV/QA/UAT) is not wired up properly yet.
// Phase 6 task: wire DEV/QA/UAT as separate projects with env vars

export default defineConfig({
  testDir: '.',
  // Phase 6 task: retries should be 0 locally, 2 in CI only
  retries: process.env.CI ? 2 : 0,
  timeout: 60000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://brislane-lending-platform.vercel.app',
    trace: 'on-first-retry',
  },
  projects: [
    // Phase 7 task: uncomment firefox, webkit and mobile
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox',      use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',       use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile-chrome',use: { ...devices['Pixel 5'] } },
    // { name: 'tablet-safari',use: { ...devices['iPad (gen 7)'] } },
  ],
});
