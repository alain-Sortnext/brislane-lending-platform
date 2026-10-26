import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPage extends BasePage {
  private get username() { return this.page.locator("#username"); }
  private get password() { return this.page.locator("#password"); }
  private get submitButton() { return this.page.locator("button.login-submit"); }
  private get authenticatedMarker() { return this.page.getByRole("button", { name: /logout|sign out/i }); }

  async login(user: string, pass: string): Promise<void> {
    await this.page.goto("/login");
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submitButton.click();
  }
  async expectAuthenticated(): Promise<void> {
    await expect(this.authenticatedMarker).toBeVisible();
  }
}
