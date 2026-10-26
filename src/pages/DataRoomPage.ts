import { expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { BasePage } from "./BasePage";

const DATA_ROOM_URL = "https://alain-sortnext.github.io/brislane-lending-platform/";

export class DataRoomPage extends BasePage {
  async open(): Promise<void> { await this.page.goto(DATA_ROOM_URL); }
  async runWcagAudit(): Promise<void> {
    const results = await new AxeBuilder({ page: this.page }).withTags(["wcag2a", "wcag2aa"]).analyze();
    expect(results.violations).toEqual([]);
  }
  async expectKeyboardFocusAvailable(): Promise<void> {
    await this.page.keyboard.press("Tab");
    const tagName = await this.page.evaluate(() => document.activeElement?.tagName ?? "");
    expect(tagName).not.toBe("");
  }
  async expectAllImagesHaveAltText(): Promise<void> {
    const count = await this.page.locator("img").evaluateAll(images =>
      images.filter(image => !(image as HTMLImageElement).alt).length);
    expect(count).toBe(0);
  }
  async expectHeadingStructure(): Promise<void> {
    const count = await this.page.locator("h1").count();
    expect(count).toBeGreaterThanOrEqual(1);
  }
  async expectTitle(): Promise<void> { await expect(this.page).toHaveTitle(/Brislane/i); }
  async setViewportAndExpectTitle(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
    await this.open();
    await this.expectTitle();
  }
}
