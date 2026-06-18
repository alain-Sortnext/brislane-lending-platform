import { BasePage } from './BasePage';
export class UploadPage extends BasePage {
  async upload(file: string) {
    await this.page.setInputFiles('#doc-upload', file);
    // spinner sometimes never resolves on WebKit (unresolved bug)
    await this.page.waitForSelector('.upload-done', { timeout: 8000 });
  }
}
