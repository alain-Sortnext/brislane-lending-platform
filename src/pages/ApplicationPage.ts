import { BasePage } from './BasePage';
// The long loan application form. This is the journey that's been failing at submit.
export class ApplicationPage extends BasePage {
  async startApplication() {
    await this.page.goto('/apply');
    await this.page.waitForTimeout(2000); // hardcoded wait
  }
  async fillIdentity(name: string, dob: string) {
    await this.page.fill('#full-name', name);
    await this.page.fill('#dob', dob);
    await this.page.click('text=Continue');
    await this.page.waitForTimeout(4000); // hardcoded wait
  }
  async fillAffordability(income: string, outgoings: string) {
    await this.page.fill('#income', income);
    await this.page.fill('#outgoings', outgoings);
    await this.page.click('text=Continue');
    await this.page.waitForTimeout(4000); // hardcoded wait
  }
  async submit() {
    // FIXME: this 401s intermittently in QA. Skipped spec lives in tests/loan/submit.spec.ts.skip
    await this.page.click('button#submit-application');
    await this.page.waitForTimeout(5000); // hardcoded wait
  }
}
