import { expect, test } from "./fixtures.ts";

test("見本サイトを閲覧し、リンクをたどってキットに取り込む", async ({ page }) => {
  await page.goto("/view/?sample=blog");
  await expect(page.getByRole("heading", { name: "はなこのおやつ日和", level: 1 })).toBeVisible();
  await expect(page.getByRole("slider")).toHaveValue("2006");

  const frame = page.frameLocator('iframe[title="プレビュー"]');
  const address = page.getByTestId("address");
  await frame.getByRole("link", { name: "はなこ", exact: true }).first().click();
  await expect(address).toHaveText(/profile\.html$/);
  await page.getByRole("button", { name: "← 戻る" }).click();
  await expect(address).toHaveText(/index\.html$/);

  await page.getByRole("button", { name: "キットに取り込む" }).click();
  await expect(page).toHaveURL(/\/kit\/$/);
  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await expect(computer.getByRole("button", { name: "はなこのおやつ日和" })).toBeVisible();
  await expect(computer.getByRole("button", { name: "profile.html" })).toBeVisible();
});

test("マイコンピュータの「見本サイト」から年代ごとの見本サイトを開き、種類の解説を読む", async ({
  page,
}) => {
  await page.goto("/kit/?year=2014");
  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await computer.getByRole("button", { name: "見本サイト" }).dblclick();
  const samples = computer.getByRole("list", { name: "見本サイトの一覧" });
  await expect(samples.getByRole("button", { name: "ほげほげ速報（2012年）" })).toBeVisible();
  await samples.getByRole("button", { name: "ほげほげまとめ（2014年）" }).dblclick();

  await expect(page).toHaveURL(/\/view\/\?sample=hogematome$/);
  await expect(page.getByRole("heading", { name: "ほげほげまとめ", level: 1 })).toBeVisible();
  await expect(page.getByRole("slider")).toHaveValue("2014");
  const frame = page.frameLocator('iframe[title="プレビュー"]');
  await frame.getByRole("link", { name: "雨の日の駅前、みんなの投稿まとめ" }).first().click();
  await expect(page.getByTestId("address")).toHaveText(/entry-0320\.html$/);
  await expect(frame.getByText("駅前のバス乗り場、傘の行列ができてる")).toBeVisible();

  await page
    .getByRole("region", { name: "このサイトについて" })
    .getByRole("button", { name: "解説" })
    .click();
  const help = page.getByRole("dialog", { name: "ヘルプ - あのころのWeb解説" });
  await expect(help.getByRole("button", { name: "まとめサイト", pressed: true })).toBeVisible();
  await expect(help.getByRole("document")).toContainText("転載禁止");
});

test("存在しない見本サイトは理由を表示する", async ({ page }) => {
  await page.goto("/view/?sample=none");
  await expect(page.getByRole("alert")).toHaveText("その見本サイトは見つかりません。");
});
