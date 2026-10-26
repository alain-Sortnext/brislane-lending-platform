import { test } from "@playwright/test";
import { DataRoomPage } from "../../src/pages/DataRoomPage";

test.describe("Brislane data room accessibility", () => {
  test("homepage passes axe-core WCAG 2.1 A/AA checks", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.runWcagAudit();
  });

  test("homepage supports keyboard focus", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.expectKeyboardFocusAvailable();
  });

  test("images have alternative text", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.expectAllImagesHaveAltText();
  });

  test("homepage has a single level-one heading", async ({ page }) => {
    const dataRoom = new DataRoomPage(page);
    await dataRoom.open();
    await dataRoom.expectHeadingStructure();
  });

  test("desktop viewport renders", async ({ page }) => {
    await new DataRoomPage(page).setViewportAndExpectTitle(1280, 720);
  });

  test("tablet viewport renders", async ({ page }) => {
    await new DataRoomPage(page).setViewportAndExpectTitle(768, 1024);
  });

  test("mobile viewport renders", async ({ page }) => {
    await new DataRoomPage(page).setViewportAndExpectTitle(375, 812);
  });
});
