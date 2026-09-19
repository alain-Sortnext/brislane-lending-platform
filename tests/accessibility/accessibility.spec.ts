import { test, expect } from '@playwright/test';
import { checkA11y, injectAxe } from '@axe-core/playwright';

// Phase 7 — Accessibility Testing
// Runs axe-core WCAG 2.1 AA checks against the Brislane data room
// Data room URL: https://alain-sortnext.github.io/brislane-lending-platform/

const DATA_ROOM_URL = 'https://alain-sortnext.github.io/brislane-lending-platform/';

test.describe('Brislane Accessibility Audit — WCAG 2.1 AA', () => {

  test('Data room homepage passes axe-core WCAG 2.1 AA', async ({ page }) => {
    await page.goto(DATA_ROOM_URL);
    await injectAxe(page);
    
    // Run axe-core — this will throw if violations are found
    // Candidates: document any violations in accessibility-audit-report.md
    await checkA11y(page, undefined, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa']
      },
      // Add known violations to ignore list here if needed
      rules: {}
    });
  });

  test('Data room is keyboard navigable', async ({ page }) => {
    await page.goto(DATA_ROOM_URL);
    
    // Tab through interactive elements
    await page.keyboard.press('Tab');
    const firstFocused = await page.evaluate(() => document.activeElement?.tagName);
    expect(firstFocused).toBeTruthy();
  });

  test('Data room images have alt text', async ({ page }) => {
    await page.goto(DATA_ROOM_URL);
    
    const imagesWithoutAlt = await page.$$eval('img', imgs => 
      imgs.filter(img => !img.alt).length
    );
    expect(imagesWithoutAlt).toBe(0);
  });

  test('Data room has correct heading structure', async ({ page }) => {
    await page.goto(DATA_ROOM_URL);
    
    // Check h1 exists
    const h1Count = await page.$$eval('h1', els => els.length);
    expect(h1Count).toBeGreaterThanOrEqual(1);
  });

  test('Desktop viewport (1280px) renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(DATA_ROOM_URL);
    await expect(page).toHaveTitle(/Brislane/i);
  });

  test('Tablet viewport (768px) renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(DATA_ROOM_URL);
    await expect(page).toHaveTitle(/Brislane/i);
  });

  test('Mobile viewport (375px) renders correctly', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(DATA_ROOM_URL);
    await expect(page).toHaveTitle(/Brislane/i);
  });

});
