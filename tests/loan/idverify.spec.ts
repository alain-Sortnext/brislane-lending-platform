import { test } from "@playwright/test";
import { ApplicationPage } from "../../src/pages/ApplicationPage";

test("identity step accepts valid details", async ({ page }) => {
  const app = new ApplicationPage(page);
  await app.startApplication();
  await app.fillIdentity("Jordan Tester", "1990-01-01");
  await app.expectAffordabilityStep();
});
