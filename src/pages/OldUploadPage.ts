// DEPRECATED? Tom thinks this is dead. grep before deleting.
import { BasePage } from './BasePage';
export class OldUploadPage extends BasePage {
  async oldUpload(file: string) {
    await this.page.setInputFiles('#upload', file); // stale selector
    await this.page.waitForTimeout(6000);
  }
}
