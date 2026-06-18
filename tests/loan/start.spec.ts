import { test, expect } from '@playwright/test';
import { ApplicationPage } from '../../src/pages/ApplicationPage';
test('applicant can start a loan application', async ({ page }) => {
  const app = new ApplicationPage(page);
  await app.startApplication();
  await expect(page).toHaveURL(/apply/);
});
