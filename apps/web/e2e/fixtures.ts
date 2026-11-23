import { test as base } from "@playwright/test";
import { BOOTED_KEY } from "../src/kit/boot/boot-session.ts";
import { ONBOARDED_KEY } from "../src/kit/onboarding/onboarding-session.ts";

export { expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(
      (keys) => {
        for (const key of keys) window.sessionStorage.setItem(key, "1");
      },
      [BOOTED_KEY, ONBOARDED_KEY],
    );
    await use(page);
  },
});
