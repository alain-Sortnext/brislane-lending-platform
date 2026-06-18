import { test, expect } from '@playwright/test';
// poor naming + unused placeholder
test('test1', async ({ page }) => {
  await page.goto('/');
  expect(true).toBeTruthy();
});
