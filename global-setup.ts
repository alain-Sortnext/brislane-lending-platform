import { request } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Phase 6 — Global Setup
// Runs ONCE before all tests
// Logs in via API and saves token to auth.json
// This is the storageState equivalent for API-based auth

const AUTH_FILE = path.join(__dirname, 'auth.json');
const BASE_URL = process.env.BASE_URL || 'https://brislane-lending-platform.vercel.app';

async function globalSetup() {
  console.log('🔐 Global setup: logging in and saving auth token...');

  const context = await request.newContext({ baseURL: BASE_URL });

  const response = await context.post('/auth/login', {
    data: {
      email: 'test.candidate@brislane.com',
      password: 'TestPass123!'
    }
  });

  if (!response.ok()) {
    throw new Error(`Login failed: ${response.status()} ${await response.text()}`);
  }

  const body = await response.json();
  
  // Save token to auth.json
  fs.writeFileSync(AUTH_FILE, JSON.stringify({
    token: body.token,
    token_type: body.token_type,
    saved_at: new Date().toISOString()
  }, null, 2));

  console.log('✅ Auth token saved to auth.json');
  await context.dispose();
}

export default globalSetup;
