import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class UploadPage extends BasePage {
  private get fileInput() { return this.page.locator("#doc-upload"); }
  private get uploadDone() { return this.page.locator(".upload-done"); }
  async upload(file: string): Promise<void> {
    await this.fileInput.setInputFiles(file);
    await expect(this.uploadDone).toBeVisible({ timeout: 15_000 });
  }
  async expectUploadComplete(): Promise<void> {
    await expect(this.uploadDone).toBeVisible();
  }
}
