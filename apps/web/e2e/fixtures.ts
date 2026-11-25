import { test as base } from "@playwright/test";
import { BOOTED_KEY } from "../src/entities/boot/model/boot-session.ts";
import { GOATCOUNTER_SCRIPT } from "../config/analytics.ts";
import { ONBOARDED_KEY } from "../src/features/onboarding/model/onboarding-session.ts";

export { expect } from "@playwright/test";

export const test = base.extend({
  page: async ({ page }, use) => {
    await page.route(GOATCOUNTER_SCRIPT, (route) =>
      route.fulfill({ contentType: "text/javascript", body: "" }),
    );
    await page.addInitScript(
      (keys) => {
        for (const key of keys) window.sessionStorage.setItem(key, "1");
      },
      [BOOTED_KEY, ONBOARDED_KEY],
    );
    await use(page);
  },
});
