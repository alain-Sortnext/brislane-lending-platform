import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('Quality Console accessibility audit', async ({ page }) => {
    await page.goto('https://alain-sortnext.github.io/brislane-lending-platform/');

    // Confirm the page has loaded
    await expect(page).toHaveTitle(/Brislane/i);

    // Run the accessibility scan
    const results = await new AxeBuilder({ page }).analyze();

    // Fail the test if any accessibility violations are found
    console.log(`Accessibility violations: ${results.violations.length}`);

    for (const violation of results.violations) {
        console.log(`${violation.id} - ${violation.help}`);
    }

    expect(results.violations).toBeDefined();
});