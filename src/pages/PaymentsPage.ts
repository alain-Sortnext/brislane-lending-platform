import { BasePage } from './BasePage';
export class PaymentsPage extends BasePage {
  // DUPLICATE selectors copy-pasted from LoginPage (should be shared)
  username = '#username';
  password = '#password';
  submitBtn = 'button.login-submit';
  async makePayment(amount: string) {
    await this.page.fill('#amount', amount);
    await this.page.click('button.pay-now');
    await this.page.waitForTimeout(3000); // hardcoded wait
  }
}
