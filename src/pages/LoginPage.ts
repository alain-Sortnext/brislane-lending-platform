import { BasePage } from './BasePage';
export class LoginPage extends BasePage {
  // raw locators leaked to callers (weak POM)
  username = '#username';
  password = '#password';
  submitBtn = 'button.login-submit';   // NOTE: duplicated in PaymentsPage
  async login(user: string, pass: string) {
    await this.page.goto('/login');
    await this.page.fill(this.username, user);
    await this.page.fill(this.password, pass);
    await this.page.click(this.submitBtn);
    await this.page.waitForTimeout(3000); // hardcoded wait
  }
}
