import { readFile } from "node:fs/promises";
import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

function computer(page: Page) {
  return page.getByRole("region", { name: "マイコンピュータ" });
}

const REMINDER = "ブラウザのデータを消すとサイトも消えます。フロッピーに保存しましょう";
const DAY_MS = 24 * 60 * 60 * 1000;

test("フロッピーに保存したファイルを開き、上書きか追加かを選ぶ", async ({ page }) => {
  await page.goto("/kit/?year=2001");
  await page
    .getByRole("region", { name: "index.html - メモ帳" })
    .getByRole("textbox", { name: "HTML" })
    .fill("<html><body><p>ファイルのテスト</p></body></html>");

  const downloading = page.waitForEvent("download");
  await computer(page).getByRole("button", { name: "フロッピーに保存" }).click();
  const download = await downloading;
  expect(download.suggestedFilename()).toBe("マイホームページ.anokoro.json");
  const path = await download.path();
  const text = await readFile(path, "utf8");
  expect(JSON.parse(text)).toMatchObject({ kind: "anokoro-site", v: 1, year: 2001 });

  await page.getByLabel("開くファイル").setInputFiles(path);
  const dialog = page.getByRole("dialog", { name: "フロッピーから開く" });
  await expect(dialog).toContainText("「マイホームページ」はもうあります。");
  await dialog.getByRole("button", { name: "別のサイトとして追加" }).click();
  await expect(computer(page).getByRole("button", { name: "マイホームページ" })).toHaveCount(2);

  await page.getByLabel("開くファイル").setInputFiles(path);
  await dialog.getByRole("button", { name: "上書き" }).click();
  await expect(computer(page).getByRole("button", { name: "マイホームページ" })).toHaveCount(2);
});

test("形式が違うファイルは開かない", async ({ page }) => {
  await page.goto("/kit/");
  await page.getByLabel("開くファイル").setInputFiles({
    name: "evil.anokoro.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"kind":"anokoro-site","v":1,"pages":"<script>"}'),
  });
  await expect(page.getByRole("dialog", { name: "フロッピーから開く" })).toContainText(
    "サイトのデータが壊れているか、形式が違います。",
  );
});

test("書き出さずに 7 日たつと、フロッピーへの保存をすすめる", async ({ page }) => {
  await page.goto("/kit/");
  await expect(computer(page).getByRole("button", { name: "マイホームページ" })).toBeVisible();
  await expect(computer(page).getByText(REMINDER)).toHaveCount(0);

  await page.clock.install({ time: Date.now() + 8 * DAY_MS });
  await page.goto("/kit/");
  await expect(computer(page).getByText(REMINDER)).toBeVisible();

  await computer(page).getByRole("button", { name: "フロッピーに保存" }).click();
  await expect(computer(page).getByText(REMINDER)).toHaveCount(0);
  await page.goto("/kit/");
  await expect(computer(page).getByRole("button", { name: "マイホームページ" })).toBeVisible();
  await expect(computer(page).getByText(REMINDER)).toHaveCount(0);
});
