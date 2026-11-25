import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

const taskbar = (page: Page) => page.getByRole("navigation", { name: "タスクバー" });
const taskbarButton = (page: Page, name: string | RegExp) =>
  taskbar(page).getByRole("button", { name });
const dialog = (page: Page, name: string) => page.getByRole("dialog", { name });
const newsButton = (page: Page) => taskbarButton(page, /^お知らせ・更新情報/);

test("左端にサイトのアイコンを出し、年を変えても同じ画像のまま", async ({ page }) => {
  await page.goto("/kit/?year=1996");
  const icon = taskbar(page).getByRole("img", { name: "あのころ Web" });
  const src = await icon.getAttribute("src");
  await page.goto("/kit/?year=2014");
  await expect(icon).toHaveAttribute("src", src ?? "");
});

test("使い方、お知らせ、このサイトについてを開き、閉じると押したボタンへフォーカスを戻す", async ({
  page,
}) => {
  await page.goto("/kit/?year=2003");

  await taskbarButton(page, "使い方").click();
  await expect(dialog(page, "使い方 - あのころ Web")).toContainText("時代チェッカー");
  await page.keyboard.press("Escape");
  await expect(dialog(page, "使い方 - あのころ Web")).toHaveCount(0);
  await expect(taskbarButton(page, "使い方")).toBeFocused();

  await taskbarButton(page, "このサイトについて").click();
  await expect(dialog(page, "このサイトについて")).toContainText("CC0-1.0");
  await expect(
    dialog(page, "このサイトについて").getByRole("link", { name: "ライセンス表記の一覧" }),
  ).toHaveAttribute("href", "/third-party-licenses.txt");
  await dialog(page, "このサイトについて").getByRole("button", { name: "閉じる" }).click();
  await expect(taskbarButton(page, "このサイトについて")).toBeFocused();

  await newsButton(page).click();
  await expect(dialog(page, "お知らせ・更新情報")).toContainText("タスクバーを追加しました");
});

test("「起動をもう一度見る」で起動の画面を出し、とばすと押したボタンへフォーカスを戻す", async ({
  page,
}) => {
  await page.goto("/kit/?year=2003");
  const bootScreen = dialog(page, "あのころ Web の起動");

  await taskbarButton(page, "起動をもう一度見る").click();
  await expect(bootScreen.getByRole("button", { name: "電源を入れる" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(bootScreen).toHaveCount(0);
  await expect(taskbarButton(page, "起動をもう一度見る")).toBeFocused();
});

test("「解説」はヘルプを開閉し、ほかのウィンドウとは同時に出さない", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const help = dialog(page, "ヘルプ - あのころのWeb解説");

  await taskbarButton(page, "使い方").click();
  await taskbarButton(page, "解説").click();
  await expect(help).toBeVisible();
  await expect(taskbarButton(page, "解説")).toHaveAttribute("aria-expanded", "true");
  await expect(dialog(page, "使い方 - あのころ Web")).toHaveCount(0);

  await taskbarButton(page, "解説").click();
  await expect(help).toHaveCount(0);
});

test("お知らせを読むと未読の印が消え、読み込み直しても消えたまま", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await expect(newsButton(page)).toContainText("未読あり");

  await newsButton(page).click();
  await expect(dialog(page, "お知らせ・更新情報")).toBeVisible();
  await expect(newsButton(page)).not.toContainText("未読あり");

  await page.reload();
  await expect(newsButton(page)).not.toContainText("未読あり");
});

test("年の表示でタイムマシンへ移る", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 700 });
  await page.goto("/kit/?year=2003");
  await taskbarButton(page, "2003年（タイムマシンへ移動）").click();
  await expect(page.getByRole("slider", { name: "年" })).toBeFocused();
});

test("この年の URL をコピーする", async ({ page, context, browserName }) => {
  test.skip(browserName !== "chromium", "クリップボードの権限は Chromium でだけ与えられる");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/kit/?year=2003");

  await taskbarButton(page, "この年の URL をコピー").click();
  await expect(taskbar(page)).toContainText("2003年のURLをコピーしました");
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("year=2003");
});

test("「ご意見・不具合報告」は、年と画面だけを入れた Issue のリンクとディスカッションへのリンクを出す", async ({
  page,
}) => {
  await page.goto("/kit/?year=1998");
  await taskbarButton(page, "ご意見・不具合報告").click();
  const feedback = dialog(page, "ご意見・不具合報告");

  const href = await feedback.getByRole("link", { name: "考証の指摘" }).getAttribute("href");
  const url = new URL(href ?? "");
  expect(url.origin + url.pathname).toBe("https://github.com/antimacho612/anokoro-web/issues/new");
  expect(Object.fromEntries(url.searchParams)).toEqual({
    template: "era-accuracy.yml",
    year: "1998",
    screen: "作成キット",
  });
  await expect(feedback.getByRole("link", { name: "不具合の報告" })).toHaveAttribute(
    "href",
    /template=bug\.yml/,
  );
  await expect(feedback.getByRole("link", { name: "要望" })).toHaveAttribute(
    "href",
    /template=feature\.yml/,
  );
  await expect(feedback.getByRole("link", { name: "ディスカッション" })).toHaveAttribute(
    "href",
    "https://github.com/antimacho612/anokoro-web/discussions",
  );
});

for (const path of ["/kit/?year=1996", "/quiz/?topic=line&seed=1", "/view/?sample=blog"]) {
  test(`ヘッダーにリポジトリへのリンクを置く（${path}）`, async ({ page }) => {
    await page.goto(path);
    const link = page.getByRole("banner").getByRole("link", { name: "ソースコード（GitHub）" });
    await expect(link).toHaveAttribute("href", "https://github.com/antimacho612/anokoro-web");
    await expect(link).toHaveAttribute("target", "_blank");
  });
}

test("リポジトリへのリンクは年を切り替えても同じ大きさと色のまま", async ({ page }) => {
  const link = page.getByRole("banner").getByRole("link", { name: "ソースコード（GitHub）" });
  const look = () =>
    link.evaluate((el) => {
      const style = getComputedStyle(el);
      return [style.width, style.height, style.color, style.backgroundColor, style.borderRadius];
    });
  await page.goto("/kit/?year=1996");
  const before = await look();
  await page.goto("/kit/?year=2014");
  expect(await look()).toEqual(before);
});
