import { defineConfig, devices } from '@playwright/test';

// TODO: env-aware config (DEV/QA/UAT) is not wired up properly yet.
// Phase 6 task: wire DEV/QA/UAT as separate projects with env vars

export default defineConfig({
  testDir: '.',
  // retries hide our flakiness instead of fixing it
  // Phase 6 task: retries should be 0 locally, 2 in CI only
  retries: 2,
  timeout: 60000,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'https://brislane-lending-platform.vercel.app',
    trace: 'off', // Phase 6 task: should be 'on-first-retry'
  },
  // only chromium is actually run today; firefox/webkit are commented out
  // Phase 7 task: uncomment firefox and webkit, add mobile viewport
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
    // { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  ],
});
