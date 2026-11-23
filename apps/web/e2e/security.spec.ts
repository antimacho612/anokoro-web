import { encodeSharedSite, toFileText, type SharedSite } from "@anokoro/share-codec";
import type { Page } from "@playwright/test";
import { ATTACK_STRINGS, PWNED_PATH, attackPage } from "./attack-strings.ts";
import { expect, test } from "./fixtures.ts";

const attackSite: SharedSite = {
  kind: "anokoro-site",
  v: 1,
  name: `<img src=x onerror="fetch('/__pw'+'ned')">`,
  year: 2001,
  genre: "personal",
  category: "diary",
  pages: [
    { path: "index.html", html: attackPage() },
    { path: "second.html", html: ATTACK_STRINGS.slice(0, 10).join("") },
  ],
};

/** スクリプトが動いた痕跡（攻撃文字列からの通信と、ダイアログ）を集める */
function watchExecution(page: Page): string[] {
  const traces: string[] = [];
  page.on("request", (request) => {
    if (new URL(request.url()).pathname === PWNED_PATH) traces.push(request.url());
  });
  page.on("dialog", (dialog) => {
    traces.push(`dialog: ${dialog.message()}`);
    void dialog.dismiss();
  });
  return traces;
}

function preview(page: Page) {
  return page.frameLocator('iframe[title="プレビュー"]');
}

async function clickEverything(page: Page, reload: () => Promise<unknown>): Promise<void> {
  const count = await preview(page).locator("a, button, summary, input").count();
  expect(count).toBeGreaterThan(0);
  for (let i = 0; i < count; i++) {
    await reload();
    await preview(page)
      .locator("a, button, summary, input")
      .nth(i)
      .click({ timeout: 2000 })
      .catch(() => {});
  }
}

test("痕跡の検出が働く", async ({ page }) => {
  const traces = watchExecution(page);
  await page.goto("/view/?sample=blog");
  await page.evaluate(() => fetch(`/__pw${"ned"}`).catch(() => {}));
  await expect.poll(() => traces.length).toBe(1);
});

test("URL で共有された攻撃文字列のサイトを開いても、スクリプトは動かない", async ({ page }) => {
  const traces = watchExecution(page);
  const url = `/view/#s=${await encodeSharedSite(attackSite)}`;
  const open = async (): Promise<void> => {
    await page.goto("/view/?sample=blog");
    await page.goto(url);
    await expect(preview(page).locator("body")).toContainText("流れる文字");
  };
  await open();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(attackSite.name);

  await clickEverything(page, open);
  await page.waitForTimeout(500);
  expect(traces).toEqual([]);
});

test("ファイルで受け取った攻撃文字列のサイトを開いても、スクリプトは動かない", async ({ page }) => {
  const traces = watchExecution(page);
  await page.goto("/kit/");
  await page.getByLabel("開くファイル").setInputFiles({
    name: "attack.anokoro.json",
    mimeType: "application/json",
    buffer: Buffer.from(toFileText(attackSite)),
  });
  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await expect(computer.getByRole("button", { name: attackSite.name })).toBeVisible();
  await expect(preview(page).locator("body")).toContainText("流れる文字");

  await clickEverything(page, async () => {
    await computer.getByRole("button", { name: "index.html" }).dblclick();
    await expect(preview(page).locator("body")).toContainText("流れる文字");
  });
  await page.waitForTimeout(500);
  expect(traces).toEqual([]);
});

test("本番ビルドの HTML には CSP が付き、画面は CSP の中で動く", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "build", "CSP は本番ビルドにだけ付ける");
  const violations: string[] = [];
  page.on("console", (message) => {
    if (message.text().includes("Content Security Policy")) violations.push(message.text());
  });

  for (const path of ["/kit/", "/view/?sample=personal", "/quiz/"]) {
    const response = await page.goto(path);
    const html = (await response?.text()) ?? "";
    expect(html).toMatch(/<head>\s*<meta http-equiv="Content-Security-Policy"/);
    expect(html).toContain('<meta name="referrer" content="strict-origin-when-cross-origin">');
    await expect(page.getByRole("navigation", { name: "タスクバー" })).toBeVisible();
  }
  await page.goto("/kit/");
  await expect(preview(page).locator("body")).not.toBeEmpty();
  expect(violations).toEqual([]);
});
