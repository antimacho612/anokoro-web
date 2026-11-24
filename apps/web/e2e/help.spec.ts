import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

const helpDialog = (page: Page) => page.getByRole("dialog", { name: "ヘルプ - あのころのWeb解説" });
const checker = (page: Page) => page.getByRole("region", { name: /^時代チェッカー/ });
const notepadHelpMenu = (page: Page) =>
  page
    .getByRole("region", { name: "index.html - メモ帳" })
    .getByRole("button", { name: "ヘルプ(H)" });
const openHelpFromNotepadMenu = async (page: Page) => {
  await notepadHelpMenu(page).click();
  await page.getByRole("menuitem", { name: "この年の解説" }).click();
};
const openedTab = (page: Page, title: string) =>
  helpDialog(page).getByRole("button", { name: title, pressed: true });

test("ヘルプははじめは出さず、警告の「解説」から、その警告のトピックで開く", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await expect(helpDialog(page)).toHaveCount(0);
  await page.getByRole("button", { name: "2020年代のコード（違反例）" }).click();

  await checker(page)
    .getByRole("listitem")
    .filter({ hasText: "<section>" })
    .getByRole("button", { name: "解説" })
    .click();
  await expect(openedTab(page, "HTMLの書き方")).toBeVisible();
  await expect(helpDialog(page).getByRole("document")).toContainText("HTML5 はまだ先の話");
  await expect(helpDialog(page)).toBeInViewport();

  await checker(page)
    .getByRole("listitem")
    .filter({ hasText: "border-radius" })
    .getByRole("button", { name: "解説" })
    .click();
  await expect(openedTab(page, "CSSの制約")).toBeVisible();
});

test("パーツの豆知識と回線から解説を開く", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await page.getByRole("button", { name: "マーキー" }).click();
  await page
    .getByRole("region", { name: "素材・パーツ箱" })
    .getByRole("button", { name: "解説" })
    .click();
  await expect(openedTab(page, "HTMLの書き方")).toBeVisible();

  await page
    .getByRole("region", { name: "回線とダイヤルアップ接続" })
    .getByRole("button", { name: "解説" })
    .click();
  await expect(openedTab(page, "回線事情")).toBeVisible();
});

test("Esc と × で閉じ、開く前のボタンへフォーカスを戻す", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const lineHelp = page
    .getByRole("region", { name: "回線とダイヤルアップ接続" })
    .getByRole("button", { name: "解説" });

  await lineHelp.click();
  await expect(helpDialog(page)).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(helpDialog(page)).toHaveCount(0);
  await expect(lineHelp).toBeFocused();

  await lineHelp.click();
  await helpDialog(page).getByRole("button", { name: "閉じる" }).click();
  await expect(helpDialog(page)).toHaveCount(0);
  await expect(lineHelp).toBeFocused();
});

test("メニューの「ヘルプ(H)」は、前のトピックのままヘルプを開閉する", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await notepadHelpMenu(page).click();
  await expect(notepadHelpMenu(page)).toHaveAttribute("aria-expanded", "true");
  await expect(page.getByRole("menuitem", { name: "この年の解説" })).toBeFocused();
  await page.getByRole("menuitem", { name: "この年の解説" }).click();
  await expect(openedTab(page, "年表")).toBeVisible();
  await helpDialog(page).getByRole("button", { name: "ブラウザ" }).click();

  await notepadHelpMenu(page).click();
  await expect(helpDialog(page)).toHaveCount(0);
  await openHelpFromNotepadMenu(page);
  await expect(openedTab(page, "ブラウザ")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(notepadHelpMenu(page)).toBeFocused();
});

test("メニューの「ヘルプ(H)」は Esc で閉じる", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await notepadHelpMenu(page).click();
  await page.keyboard.press("ArrowDown");
  await expect(page.getByRole("menuitem", { name: "時代まちがいさがし" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("menu")).toHaveCount(0);
  await expect(notepadHelpMenu(page)).toBeFocused();
});

test("タイムマシンバーの「この年の解説」から、選んだ年の解説を開閉する", async ({ page }) => {
  await page.goto("/kit/?year=2001");
  const yearHelp = page
    .getByRole("group", { name: "タイムマシン" })
    .getByRole("button", { name: "この年の解説" });

  await yearHelp.click();
  await expect(openedTab(page, "年表")).toBeVisible();
  await expect(helpDialog(page).getByRole("document")).toContainText(
    "Internet Explorer 6の日本語版が公開される",
  );
  await expect(helpDialog(page).getByRole("document")).not.toContainText("ココログ");

  await yearHelp.click();
  await expect(helpDialog(page)).toHaveCount(0);
});

test("選んだ年より後の内容は出さない", async ({ page }) => {
  await page.goto("/kit/?year=2001");
  await openHelpFromNotepadMenu(page);
  const body = helpDialog(page).getByRole("document");
  await expect(openedTab(page, "年表")).toBeVisible();
  await expect(body).toContainText("Internet Explorer 6の日本語版が公開される");
  await expect(body).not.toContainText("ココログ");

  await page.goto("/kit/?year=1998");
  await openHelpFromNotepadMenu(page);
  await expect(openedTab(page, "年表")).toBeVisible();
  await expect(body).toContainText("長野冬季五輪");
  await expect(body).not.toContainText("ADSLの試験提供");
});
