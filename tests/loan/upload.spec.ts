import { test } from "@playwright/test";
import { ApplicationPage } from "../../src/pages/ApplicationPage";

test("document upload completes", async ({ page }) => {
  const app = new ApplicationPage(page);
  await page.goto("/apply/documents");
  await app.uploadDocument("test-data/sample-payslip.pdf");
});
