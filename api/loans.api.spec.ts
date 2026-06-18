import { test, expect, request } from '@playwright/test';
const API = process.env.API_URL || 'https://api-qa.brislane.example';
const TOKEN = 'eyJhbGciOiJIUzI1NiJ9.EXPIRED.PLACEHOLDER';
// No negative tests, no contract validation, no expired-token rejection test.
test('submit loan', async () => {
  const ctx = await request.newContext({ extraHTTPHeaders: { Authorization: `Bearer ${TOKEN}` } });
  const res = await ctx.post(`${API}/loans/submit`, { data: { applicationId: '123' } });
  // should assert 200 and schema; currently asserts nothing meaningful
  expect(res).toBeTruthy();
});
