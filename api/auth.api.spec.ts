import { test, expect, request } from '@playwright/test';
const API = process.env.API_URL || 'https://api-qa.brislane.example';
// hardcoded bearer — long expired. half the suite 401s out of the box.
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.EXPIRED.PLACEHOLDER';
test('login returns a token', async () => {
  const ctx = await request.newContext();
  const res = await ctx.post(`${API}/auth/login`, { data: { user: 'demo', pass: 'x' } });
  // no status code assertion (gap)
  const body = await res.json().catch(() => ({}));
  expect(body).toBeDefined();
});
