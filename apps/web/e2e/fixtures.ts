import { test as base } from "@playwright/test";
import { BOOTED_KEY } from "../src/kit/boot/boot-session.ts";

export { expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript((key) => window.sessionStorage.setItem(key, "1"), BOOTED_KEY);
    await use(page);
  },
});
