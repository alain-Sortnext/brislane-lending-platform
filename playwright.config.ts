import { defineConfig, devices } from '@playwright/test';
// TODO: env-aware config (DEV/QA/UAT) is not wired up properly yet.
export default defineConfig({
  testDir: '.',
  // retries hide our flakiness instead of fixing it
  retries: 2,
  timeout: 60000,
  reporter: 'list',
  use: {
    baseURL: process.env.BASE_URL || 'https://qa.brislane.example',
    trace: 'off', // should be 'on-first-retry'
  },
  // only chromium is actually run today; firefox/webkit are commented out
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit',  use: { ...devices['Desktop Safari'] } },
  ],
});
