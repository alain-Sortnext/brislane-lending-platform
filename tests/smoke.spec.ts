import { test, expect } from '@playwright/test';

test('Playwright smoke test', async ({ page }) => {
    await page.setContent('<h1>Framework Working</h1>');

    await expect(page.locator('h1')).toHaveText('Framework Working');
});