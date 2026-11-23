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

test("存在しない見本サイトは理由を表示する", async ({ page }) => {
  await page.goto("/view/?sample=none");
  await expect(page.getByRole("alert")).toHaveText("その見本サイトは見つかりません。");
});
