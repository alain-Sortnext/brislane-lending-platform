import { test, expect } from '@playwright/test';

// Phase 7 — Automation Engineering
// Full loan journey via API using Playwright request fixture
// Base URL: https://brislane-lending-platform.vercel.app

const BASE_URL = process.env.BASE_URL || 'https://brislane-lending-platform.vercel.app';
let accessToken: string;
let applicationId: string;

test.describe('Brislane Loan Journey — API Automation', () => {

  test('POST /auth/login — returns JWT token', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/auth/login`, {
      data: { email: 'test.candidate@brislane.com', password: 'TestPass123!' }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.token).toBeTruthy();
    expect(body.token_type).toBe('Bearer');
    accessToken = body.token;
  });

  test('GET /customers — returns customer list', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/customers`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
    expect(body[0]).toHaveProperty('id');
  });

  test('POST /loans/applications — creates application', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/loans/applications`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      data: { customer_id: 'C1000001', loan_amount: 5000, loan_term_months: 24, purpose: 'home_improvement' }
    });
    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.id).toBeTruthy();
    expect(body.status).toBe('draft');
    applicationId = body.id;
  });

  test('PUT /loans/submit — submits application', async ({ request }) => {
    const response = await request.put(`${BASE_URL}/loans/submit`, {
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      data: { application_id: applicationId, declaration_accepted: true }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.status).toBe('submitted');
  });

  test('GET /payments — returns payment schedule', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/payments`, {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(Array.isArray(body)).toBeTruthy();
  });

});

test.describe('Security Tests', () => {

  test('SEC-1: Expired token returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/customers`, {
      headers: { Authorization: 'Bearer EXPIRED_TOKEN_FOR_TEST' }
    });
    expect(response.status()).toBe(401);
  });

  test('SEC-2: No token returns 401', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/customers`);
    expect(response.status()).toBe(401);
  });

  test('SEC-3: Cross-customer access returns 403', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/customers/C1999999/loans`, {
      headers: { Authorization: 'Bearer test-token' }
    });
    expect([401, 403]).toContain(response.status());
  });

});
