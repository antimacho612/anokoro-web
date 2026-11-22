import { test as base } from "@playwright/test";

export { expect } from "@playwright/test";

/** 起動の演出を見終えた状態から始める。キーは src/kit/boot/boot-session.ts の BOOTED_KEY */
export const test = base.extend({
  page: async ({ page }, use) => {
    await page.addInitScript(() => window.sessionStorage.setItem("anokoro:booted", "1"));
    await use(page);
  },
});
