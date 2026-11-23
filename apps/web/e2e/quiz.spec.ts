import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

// シードで問題が決まる（packages/quiz の generateQuestion）。
// 26: 2005 年のネットショップに border-radius（表示モードで答えられる）
// 2: 2010 年の企業サイトの <style> に :is()（表示モードで答えられる）
// 157: 1999 年の掲示板に position:sticky（ソース表示モードだけ）
// 52: 1999 年、光ファイバーで読み込む回線の問題
const DISPLAY_SEED = 26;
const RULE_SEED = 2;
const SOURCE_ONLY_SEED = 157;
const LINE_SEED = 52;

const pageFrame = (page: Page) => page.frameLocator('iframe[title="お題のページ"]');
const answerWindow = (page: Page) => page.getByRole("region", { name: "答え" });
const result = (page: Page) => answerWindow(page).getByRole("status");
const helpDialog = (page: Page) => page.getByRole("dialog", { name: "ヘルプ - あのころのWeb解説" });

async function waitForPage(page: Page): Promise<void> {
  await expect(page.getByRole("status").filter({ hasText: "ページが表示されました" })).toBeVisible({
    timeout: 30_000,
  });
}

test("表示モードで時代外れの要素を選ぶと正解し、解説を開ける", async ({ page }) => {
  await page.goto(`/quiz/?seed=${DISPLAY_SEED}`);
  await expect(answerWindow(page)).toContainText("2005年のネットショップ");
  await waitForPage(page);

  await pageFrame(page)
    .locator("[anokoro-quiz-answer]")
    .click({ position: { x: 4, y: 4 } });
  await expect(result(page)).toContainText("一発正解！");
  await expect(result(page)).toContainText("2011年から。2005年より 6 年先の技術でした");
  await expect(result(page)).toContainText('style="border-radius:10px"');

  await answerWindow(page).getByRole("button", { name: "解説を開く" }).click();
  await expect(
    helpDialog(page).getByRole("button", { name: "CSSの制約", pressed: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(helpDialog(page)).toHaveCount(0);
});

test("間違えると残りが減り、3 回で答えを示す。同じ場所の選び直しは数えない", async ({ page }) => {
  await page.goto(`/quiz/?seed=${DISPLAY_SEED}`);
  await waitForPage(page);
  const frame = pageFrame(page);

  await frame.locator("a", { hasText: "ご利用ガイド" }).click();
  await expect(result(page)).toHaveText("ちがうようです（残り 2 回）");
  await expect(frame.locator("a", { hasText: "ご利用ガイド" })).toHaveAttribute(
    "data-quiz-miss",
    "",
  );
  await frame.locator("a", { hasText: "ご利用ガイド" }).click();
  await expect(result(page)).toHaveText("そこはもう選びました");
  await expect(answerWindow(page).getByLabel("残り 2 回")).toBeVisible();

  await answerWindow(page).getByRole("button", { name: "ページではなく回線がおかしい" }).click();
  await expect(result(page)).toHaveText("ちがうようです（残り 1 回）");

  await page.getByRole("button", { name: "ソース", exact: true }).click();
  await page.getByRole("button", { name: /^1 行目/ }).click();
  await expect(result(page)).toContainText("答えはここでした");
  await expect(answerWindow(page).getByRole("button", { name: "解説を開く" })).toBeVisible();
  await expect(page.getByRole("button", { name: /border-radius/ })).toHaveClass(/lineReveal/);

  await page.getByRole("button", { name: "表示", exact: true }).click();
  await expect(frame.locator("[anokoro-quiz-answer]")).toHaveAttribute("data-quiz-reveal", "");
});

test("<style> の規則の問題は、見た目が変わった要素を選ぶと正解", async ({ page }) => {
  await page.goto(`/quiz/?seed=${RULE_SEED}`);
  await expect(answerWindow(page)).toContainText("2010年の企業・お店の公式サイト");
  await waitForPage(page);

  await pageFrame(page).locator("h2", { hasText: "新着情報" }).click();
  await expect(result(page)).toContainText("正解！");
  await expect(pageFrame(page).locator("h2", { hasText: "新着情報" })).toHaveAttribute(
    "data-quiz-hit",
    "",
  );
});

test("ソース表示の文字の大きさを切り替え、次に開いたときも保つ", async ({ page }) => {
  await page.goto(`/quiz/?seed=${SOURCE_ONLY_SEED}`);
  const source = page.getByRole("list", { name: "お題のソース" });
  await expect(source).toHaveCSS("font-size", "13px");
  await page.getByRole("button", { name: "文字の大きさ：大" }).click();
  await expect(source).toHaveCSS("font-size", "16px");
  await page.reload();
  await expect(page.getByRole("list", { name: "お題のソース" })).toHaveCSS("font-size", "16px");
});

test("ソース表示モードだけの問題は、行を選んで答える", async ({ page }) => {
  await page.goto(`/quiz/?seed=${SOURCE_ONLY_SEED}`);
  await expect(page.getByRole("button", { name: "ソース", exact: true })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await expect(page.getByRole("button", { name: /^\d+ 行目/ }).first()).toBeVisible();
  await page.getByRole("button", { name: /position:sticky/ }).click();
  await expect(result(page)).toContainText("正解！");
});

test("回線の問題は「ページではなく回線がおかしい」で正解", async ({ page }) => {
  await page.goto(`/quiz/?seed=${LINE_SEED}`);
  await expect(answerWindow(page)).toContainText("1999年");
  await answerWindow(page).getByRole("button", { name: "ページではなく回線がおかしい" }).click();
  await expect(result(page)).toContainText("正解！");
  await expect(result(page)).toContainText("1999年にはまだ選べませんでした");

  await answerWindow(page).getByRole("button", { name: "解説を開く" }).click();
  await expect(
    helpDialog(page).getByRole("button", { name: "回線事情", pressed: true }),
  ).toBeVisible();
});

test("「次の問題」はトピックを保ったまま新しいシードで出す", async ({ page }) => {
  await page.goto("/quiz/?topic=line&seed=1");
  await answerWindow(page).getByRole("button", { name: "ページではなく回線がおかしい" }).click();
  await answerWindow(page).getByRole("button", { name: "次の問題" }).click();
  await expect(page).toHaveURL(/\/quiz\/\?topic=line&seed=\d+$/);
  expect(new URL(page.url()).searchParams.get("seed")).not.toBe("1");
  await expect(answerWindow(page).getByLabel("残り 3 回")).toBeVisible();
});

test("問題を作れない条件では、お知らせを出してランダムに出す", async ({ page }) => {
  await page.goto("/quiz/?topic=text");
  await expect(result(page)).toHaveText("この条件の問題はまだありません");
  await expect(page).toHaveURL(/\/quiz\/\?seed=\d+$/);
});

test("作成キットのタスクバー、ヘルプ(H)、解説から開く。タイムマシンには入口を置かない", async ({
  page,
}) => {
  await page.goto("/kit/?year=2003");
  await expect(
    page.getByRole("group", { name: "タイムマシン" }).getByRole("link", { name: "まちがいさがし" }),
  ).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "タスクバー" })
    .getByRole("link", { name: "まちがいさがし" })
    .click();
  await expect(page).toHaveURL(/\/quiz\/\?seed=\d+$/);
  await expect(answerWindow(page)).toBeVisible();

  await page.goto("/kit/?year=2003");
  await page
    .getByRole("region", { name: "index.html - メモ帳" })
    .getByRole("button", { name: "ヘルプ(H)" })
    .click();
  await page.getByRole("menuitem", { name: "時代まちがいさがし" }).click();
  await expect(page).toHaveURL(/\/quiz\/\?seed=\d+$/);
  await expect(answerWindow(page)).toBeVisible();

  await page.goto("/kit/?year=2003");
  await page.getByRole("button", { name: "2020年代のコード（違反例）" }).click();
  await page
    .getByRole("region", { name: /^時代チェッカー/ })
    .getByRole("listitem")
    .filter({ hasText: "border-radius" })
    .getByRole("button", { name: "解説" })
    .click();
  await helpDialog(page).getByRole("link", { name: "この技術でまちがいさがし" }).click();
  await expect(page).toHaveURL(/\/quiz\/\?topic=css&seed=\d+$/);

  await page.goto("/kit/?year=2003");
  await page
    .getByRole("group", { name: "タイムマシン" })
    .getByRole("button", { name: "この年の解説" })
    .click();
  await helpDialog(page).getByRole("button", { name: "文字コード" }).click();
  await expect(
    helpDialog(page).getByRole("link", { name: "この技術でまちがいさがし" }),
  ).toHaveCount(0);
});

test("タスクバーに作成キットへ戻るリンクと今日の 1 問を置き、作成キットと同じ窓を開ける", async ({
  page,
}) => {
  await page.goto(`/quiz/?seed=${DISPLAY_SEED}`);
  const taskbar = page.getByRole("navigation", { name: "タスクバー" });
  await expect(taskbar.getByRole("link", { name: "作成キットへ戻る" })).toHaveAttribute(
    "href",
    "/kit/?year=2005",
  );
  await expect(taskbar.getByRole("link", { name: "今日の 1 問" })).toHaveAttribute(
    "href",
    "/quiz/?daily",
  );
  await expect(taskbar.getByLabel("出題年 2005年")).toBeVisible();

  await taskbar.getByRole("button", { name: "このサイトについて" }).click();
  await expect(page.getByRole("dialog", { name: "このサイトについて" })).toBeVisible();
  await taskbar.getByRole("button", { name: "解説" }).click();
  await expect(helpDialog(page)).toBeVisible();
  await expect(page.getByRole("dialog", { name: "このサイトについて" })).toHaveCount(0);
});
