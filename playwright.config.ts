import { defineConfig, devices } from '@playwright/test';

// ============================================================
// Brislane Lending Platform — Playwright Config
// ============================================================
//
// PHASE 6 TASKS (fix these):
// 1. Uncomment globalSetup below
// 2. Wire DEV/QA/UAT as separate projects with env vars
// 3. Change retries to: process.env.CI ? 2 : 0
// 4. Change trace to: 'on-first-retry'
//
// PHASE 7 TASKS (uncomment these):
// 1. Uncomment firefox, webkit, mobile projects below
//
// PHASE 8 TASKS (fix these):
// 1. Fix .github/workflows/ci.yml — add missing browser install step
// ============================================================

export default defineConfig({

  // Phase 6 task: uncomment this line
  // globalSetup: './global-setup.ts',

  // Phase 6 task: retries should be 0 locally, 2 in CI only
  retries: 2,
  timeout: 60000,
  reporter: [['list'], ['html', { open: 'never' }]],

  use: {
    baseURL: process.env.BASE_URL || 'https://brislane-lending-platform.vercel.app',
    trace: 'off', // Phase 6 task: change to 'on-first-retry'
  },

  projects: [
    // ── PHASE 7 — API Tests (run these first) ──────────────
    {
      name: 'api-chromium',
      testDir: './tests/api',
      use: { ...devices['Desktop Chrome'] }
    },

    // ── PHASE 7 — Accessibility Tests ──────────────────────
    {
      name: 'accessibility-chromium',
      testDir: './tests/accessibility',
      use: { ...devices['Desktop Chrome'] }
    },

    // ── PHASE 7 TASK: uncomment these for cross-browser ────
    // { name: 'api-firefox',           testDir: './tests/api',           use: { ...devices['Desktop Firefox'] } },
    // { name: 'api-webkit',            testDir: './tests/api',           use: { ...devices['Desktop Safari'] } },
    // { name: 'api-mobile',            testDir: './tests/api',           use: { ...devices['Pixel 5'] } },
    // { name: 'accessibility-firefox', testDir: './tests/accessibility', use: { ...devices['Desktop Firefox'] } },
    // { name: 'accessibility-webkit',  testDir: './tests/accessibility', use: { ...devices['Desktop Safari'] } },

    // ── INHERITED (broken — tech debt to fix in Phase 6) ───
    // These hit qa.brislane.example which does not exist
    // They are intentionally broken as tech debt for you to discover
    // Do NOT fix them by changing the URL — fix them by refactoring
    // the page objects to work against the real mock API
    {
      name: 'inherited-broken',
      testDir: './tests/auth',
      use: { ...devices['Desktop Chrome'] }
    },
  ],
});
