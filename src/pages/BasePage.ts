import type { Locator, Page } from "@playwright/test";

/** Shared base; browser page stays protected from test code. */
export abstract class BasePage {
  public constructor(protected readonly page: Page) {}

  protected byRole(role: Parameters<Page["getByRole"]>[0], name: string | RegExp): Locator {
    return this.page.getByRole(role, { name });
  }
}
