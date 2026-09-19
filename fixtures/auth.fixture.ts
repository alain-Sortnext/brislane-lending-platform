import { test as base, request } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Phase 6 — Auth Fixture
// Replaces UI re-login per test with a shared storageState
// 
// TECH DEBT THIS FIXES:
// Before: every test called login.login() via the UI — slow, flaky, mints fresh JWT per test
// After: single API login saves token to auth.json — all tests share it
//
// HOW IT WORKS:
// 1. global-setup.ts runs once before all tests — calls POST /auth/login
// 2. Saves the response token to auth.json (gitignored)
// 3. This fixture loads auth.json into every test's context
// 4. Tests never touch the login UI

const AUTH_FILE = path.join(__dirname, '../auth.json');
const BASE_URL = process.env.BASE_URL || 'https://brislane-lending-platform.vercel.app';

// Type for our extended fixtures
type AuthFixtures = {
  authenticatedRequest: Awaited<ReturnType<typeof request.newContext>>;
  accessToken: string;
};

export const test = base.extend<AuthFixtures>({
  // Provides an authenticated request context
  authenticatedRequest: async ({}, use) => {
    // Read token from auth.json (saved by global-setup.ts)
    let token = '';
    if (fs.existsSync(AUTH_FILE)) {
      const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      token = authData.token || '';
    }

    const context = await request.newContext({
      baseURL: BASE_URL,
      extraHTTPHeaders: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    await use(context);
    await context.dispose();
  },

  // Provides just the token string
  accessToken: async ({}, use) => {
    let token = '';
    if (fs.existsSync(AUTH_FILE)) {
      const authData = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      token = authData.token || '';
    }
    await use(token);
  }
});

export { expect } from '@playwright/test';
