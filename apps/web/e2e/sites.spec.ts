import type { Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

function notepad(page: Page, path = "index.html") {
  return page.getByRole("region", { name: `${path} - メモ帳` });
}

function frame(page: Page) {
  return page.frameLocator('iframe[title="プレビュー"]');
}

test("書いた内容は自動で保存され、読み込み直しても残る", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await expect(computer.getByRole("button", { name: "マイホームページ" })).toBeVisible();

  const textarea = notepad(page).getByRole("textbox", { name: "HTML" });
  await textarea.fill("<html><body><p>保存のテスト</p></body></html>");
  await expect(page.getByRole("heading", { name: "index.html - メモ帳" })).toHaveText(
    "*index.html - メモ帳",
  );
  await expect(page.getByRole("heading", { name: "index.html - メモ帳" })).toHaveText(
    "index.html - メモ帳",
  );

  await page.goto("/kit/");
  await expect(notepad(page).getByRole("textbox", { name: "HTML" })).toHaveValue(
    "<html><body><p>保存のテスト</p></body></html>",
  );
  await expect(page.getByRole("slider")).toHaveValue("2003");
});

test("ページを足し、リンクをたどって戻ると進む", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await expect(computer.getByRole("button", { name: "index.html" })).toBeVisible();

  await notepad(page)
    .getByRole("textbox", { name: "HTML" })
    .fill('<html><body><a href="diary.html">日記へ</a> <a href="nai.html">ない</a></body></html>');
  await computer.getByRole("button", { name: "新しいページ" }).click();
  const dialog = page.getByRole("dialog", { name: "新しいページ" });
  await dialog.getByRole("textbox", { name: "ファイル名" }).fill("diary");
  await dialog.getByRole("button", { name: "OK" }).click();
  await expect(notepad(page, "diary.html")).toBeVisible();
  await notepad(page, "diary.html")
    .getByRole("textbox", { name: "HTML" })
    .fill('<html><body><p>きょうの日記</p><a href="index.html">トップ</a></body></html>');

  await computer.getByRole("button", { name: "index.html" }).dblclick();
  await expect(notepad(page)).toBeVisible();
  const address = page.getByTestId("address");
  await expect(address).toHaveText("http://www.hogespace.example/~you/index.html");

  await frame(page).getByRole("link", { name: "日記へ" }).click();
  await expect(frame(page).getByText("きょうの日記")).toBeVisible();
  await expect(address).toHaveText("http://www.hogespace.example/~you/diary.html");
  await expect(notepad(page, "diary.html")).toBeVisible();

  await page.getByRole("button", { name: "← 戻る" }).click();
  await expect(frame(page).getByRole("link", { name: "日記へ" })).toBeVisible();
  await page.getByRole("button", { name: "進む →" }).click();
  await expect(frame(page).getByText("きょうの日記")).toBeVisible();

  await page.getByRole("button", { name: "ホーム", exact: true }).click();
  await frame(page).getByRole("link", { name: "ない" }).click();
  await expect(frame(page).getByText("ページが見つかりません")).toBeVisible();
  await expect(address).toHaveText("http://www.hogespace.example/~you/nai.html");
  await page.getByRole("button", { name: "← 戻る" }).click();
  await expect(frame(page).getByRole("link", { name: "日記へ" })).toBeVisible();
});

test("新しいサイトを種類と年を選んで作り、まだない種類は選べない", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const computer = page.getByRole("region", { name: "マイコンピュータ" });
  await computer.getByRole("button", { name: "新しいサイト" }).click();
  const dialog = page.getByRole("dialog", { name: "新しいサイト" });
  await dialog.getByRole("combobox", { name: "年" }).selectOption("1997");
  await expect(dialog.getByRole("radio", { name: /ブログ/ })).toBeDisabled();
  await expect(dialog.getByText("（2003 年から）")).toBeVisible();
  await dialog.getByRole("radio", { name: /掲示板/ }).check();
  await dialog.getByRole("textbox", { name: "サイト名" }).fill("ほげ掲示板");
  await dialog.getByRole("button", { name: "作成" }).click();

  await expect(computer.getByRole("button", { name: "ほげ掲示板" })).toBeVisible();
  await expect(page.getByRole("slider")).toHaveValue("1997");
  await expect(computer.getByText(/1997 年 ／ 掲示板/)).toBeVisible();
  await expect(page.getByRole("region", { name: /^時代チェッカー/ })).toContainText("再現度 100%");
});
