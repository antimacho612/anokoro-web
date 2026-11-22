import { expect, test, type Page } from "@playwright/test";

const statusBar = (page: Page) =>
  page.getByRole("region", { name: /ネットサーファー$/ }).getByRole("status");
const preview = (page: Page) => page.frameLocator('iframe[title="プレビュー"]');
const lineWindow = (page: Page) => page.getByRole("region", { name: "回線とダイヤルアップ接続" });

test("常時接続の回線で、回線経由で読み込んで表示し終える", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await page.getByRole("button", { name: "更新", exact: true }).click();

  await expect(statusBar(page)).toHaveText(/^ページが表示されました（\d+\.\d秒）$/);
  await expect(preview(page).locator(".__ctr")).toHaveText("000775");
  await expect(preview(page).locator("[data-anokoro-img]")).toHaveCount(0);
  await expect(lineWindow(page)).toContainText(/前回の読み込み：\d+\.\d秒／[\d.]+KB（ADSL 12M）/);
});

test("未接続のダイヤルアップでは、ダイヤルしてから読み込む", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await lineWindow(page).getByLabel("回線:").selectOption("isdn");
  await expect(lineWindow(page)).toContainText("未接続");

  await page.getByRole("button", { name: "更新", exact: true }).click();
  await expect(lineWindow(page)).toContainText("接続しています...");
  await expect(lineWindow(page)).toContainText("接続中 64Kbps");
  await expect(statusBar(page)).toHaveText(/^ページが表示されました/, { timeout: 15_000 });
  await expect(lineWindow(page)).toContainText(/接続時間 \d\d:\d\d:\d\d/);

  await lineWindow(page).getByRole("button", { name: "切断" }).click();
  await expect(lineWindow(page)).toContainText("未接続");
});

test("中止すると、途中の表示のまま止まる", async ({ page }) => {
  await page.goto("/kit/?year=2000");
  await lineWindow(page).getByRole("button", { name: "接続" }).click();
  await expect(statusBar(page)).toHaveText("64Kbps で接続しました");

  await page.getByRole("button", { name: "更新", exact: true }).click();
  await expect(statusBar(page)).toContainText("をダウンロードしています...");
  const stop = page.getByRole("button", { name: "中止" });
  await stop.click();

  await expect(statusBar(page)).toHaveText("中止しました");
  await expect(stop).toBeDisabled();
  await expect(preview(page).locator("[data-anokoro-img]").first()).toBeAttached();
});

test("キリ番を踏むと知らせる", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("anokoro:counter", "776"));
  await page.goto("/kit/?year=2003");
  await page.getByRole("button", { name: "更新", exact: true }).click();

  await expect(page.getByRole("alert")).toHaveText(
    "★☆ キリ番 777 ゲット！おめでとうございます！掲示板で報告してね ☆★",
  );
  await expect(preview(page).locator(".__ctr")).toHaveText("000777");
});

test("プレビューの iframe は、ローカル表示でも回線経由表示でも allow-same-origin だけを許す", async ({
  page,
}) => {
  const frame = page.locator('iframe[title="プレビュー"]');
  await page.goto("/kit/?year=2003");
  await expect(frame).toHaveAttribute("sandbox", "allow-same-origin");

  await page.getByRole("button", { name: "更新", exact: true }).click();
  await expect(statusBar(page)).toHaveText(/^ページが表示されました/);
  await expect(frame).toHaveAttribute("sandbox", "allow-same-origin");
});
