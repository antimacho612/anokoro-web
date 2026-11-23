import { expect, test } from "./fixtures.ts";

test("URL で共有したサイトを閲覧画面で開き、キットに取り込む", async ({ page }) => {
  await page.goto("/kit/?year=2001");
  await page
    .getByRole("region", { name: "index.html - メモ帳" })
    .getByRole("textbox", { name: "HTML" })
    .fill("<html><body><p>共有のテスト</p></body></html>");

  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await computer.getByRole("button", { name: "URL で共有" }).click();
  const dialog = page.getByRole("dialog", { name: "URL で共有" });
  const urlBox = dialog.getByRole("textbox", { name: "共有用の URL" });
  await expect(urlBox).toHaveValue(/\/view\/#s=/);
  await expect(dialog.getByText(/^[\d,]+ 文字$/)).toBeVisible();
  const url = await urlBox.inputValue();

  await page.goto(url);
  await expect(page.getByRole("heading", { name: "マイホームページ", level: 1 })).toBeVisible();
  await expect(page.getByRole("slider")).toHaveValue("2001");
  await expect(
    page.frameLocator('iframe[title="プレビュー"]').getByText("共有のテスト"),
  ).toBeVisible();

  await page.getByRole("button", { name: "キットに取り込む" }).click();
  await expect(page).toHaveURL(/\/kit\/$/);
  await expect(
    page.getByRole("region", { name: "マイコンピュータ" }).getByRole("button", {
      name: "マイホームページ",
    }),
  ).toHaveCount(2);
});

test("壊れた共有 URL は開かずに理由を表示する", async ({ page }) => {
  await page.goto("/view/#s=AAAA");
  await expect(page.getByRole("alert")).toHaveText(
    "サイトのデータが壊れているか、形式が違います。",
  );
});
