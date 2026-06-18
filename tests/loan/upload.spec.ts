import { test, expect } from '@playwright/test';
import { UploadPage } from '../../src/pages/UploadPage';
// flaky: passes ~70% of the time, spinner hangs on WebKit
test('document upload completes', async ({ page }) => {
  const up = new UploadPage(page);
  await page.goto('/apply/documents');
  await up.upload('test-data/sample-payslip.pdf');
  await expect(page.locator('.upload-done')).toBeVisible();
});
