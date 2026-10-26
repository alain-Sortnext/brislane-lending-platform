import { test } from "@playwright/test";
import { ApplicationPage } from "../../src/pages/ApplicationPage";

// Regression is enabled. Execute only with synthetic test data in an authorised non-production environment.
test("applicant can submit a completed application", async ({ page }) => {
  const application = new ApplicationPage(page);
  await application.startApplication();
  await application.fillIdentity("Jordan Tester", "1990-01-01");
  await application.fillAffordability("3200", "1400");
  await application.submit();
  await application.expectSubmitted();
});
