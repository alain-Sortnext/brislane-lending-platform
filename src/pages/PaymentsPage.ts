import { expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class PaymentsPage extends BasePage {
  private get amountField() { return this.page.locator("#amount"); }
  private get payNowButton() { return this.page.getByRole("button", { name: /pay now/i }); }
  private get paymentConfirmation() { return this.page.getByRole("status"); }

  async makePayment(amount: string): Promise<void> {
    await this.amountField.fill(amount);
    await this.payNowButton.click();
  }
  async expectPaymentConfirmed(): Promise<void> {
    await expect(this.paymentConfirmation).toContainText(/payment|scheduled|success/i);
  }
}
