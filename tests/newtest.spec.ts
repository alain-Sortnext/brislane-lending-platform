import { test, expect } from '@playwright/test';
// poor naming, copy of test1
test('newtest', async ({ page }) => {
  await page.goto('/');
  expect(1 + 1).toBe(2);
});
