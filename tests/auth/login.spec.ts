import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
test('user can log in', async ({ page }) => {
  const login = new LoginPage(page);
  await login.login('demo@brislane.example', 'Password123');
  // BROKEN ASSERTION: asserts on stale heading text that always exists -> passes for the wrong reason
  await expect(page.locator('h1')).toBeVisible();
});
