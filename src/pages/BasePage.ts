import { Page } from '@playwright/test';
// Weak base: exposes the raw page, no encapsulation, no shared waits.
export class BasePage {
  constructor(public page: Page) {}
}
