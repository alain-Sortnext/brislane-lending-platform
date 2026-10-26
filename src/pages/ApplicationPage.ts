import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ApplicationPage extends BasePage {
  private get fullName() { return this.page.locator("#full-name"); }
  private get dateOfBirth() { return this.page.locator("#dob"); }
  private get income() { return this.page.locator("#income"); }
  private get outgoings() { return this.page.locator("#outgoings"); }
  private get continueButton() { return this.page.getByRole("button", { name: /continue/i }); }
  private get submitButton() { return this.page.locator("button#submit-application"); }
  private get submittedNotice() { return this.page.locator(".application-submitted"); }
  private get affordabilityStep() { return this.page.locator(".step-affordability"); }
  private get uploadCompleteNotice() { return this.page.locator(".upload-done"); }

  async startApplication(): Promise<void> {
    await this.page.goto("/apply");
    await expect(this.page).toHaveURL(/apply/);
  }
  async fillIdentity(name: string, dob: string): Promise<void> {
    await this.fullName.fill(name);
    await this.dateOfBirth.fill(dob);
    await this.continueButton.click();
    await expect(this.affordabilityStep).toBeVisible();
  }
  async fillAffordability(monthlyIncome: string, monthlyOutgoings: string): Promise<void> {
    await this.income.fill(monthlyIncome);
    await this.outgoings.fill(monthlyOutgoings);
    await this.continueButton.click();
  }
  async submit(): Promise<void> {
    await this.submitButton.click();
  }
  async expectSubmitted(): Promise<void> {
    await expect(this.submittedNotice).toBeVisible();
  }
  async expectAffordabilityStep(): Promise<void> {
    await expect(this.affordabilityStep).toBeVisible();
  }
  async expectApplyUrl(): Promise<void> {
    await expect(this.page).toHaveURL(/apply/);
  }
  async uploadDocument(file: string): Promise<void> {
    await this.page.locator("#doc-upload").setInputFiles(file);
    await expect(this.uploadCompleteNotice).toBeVisible({ timeout: 15_000 });
  }
}
