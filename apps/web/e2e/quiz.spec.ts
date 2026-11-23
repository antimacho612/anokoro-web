import { type Page } from "@playwright/test";
import { expect, test } from "./fixtures.ts";

// シードで問題が決まる（packages/quiz の generateQuestion）。
// 27: 2003 年の個人ホームページに border-radius（表示モードで答えられる）
// 12: 2001 年の個人ホームページに position:sticky（ソース表示モードだけ）
// 7: 1995 年、光ファイバーで読み込む回線の問題
const DISPLAY_SEED = 27;
const SOURCE_ONLY_SEED = 12;
const LINE_SEED = 7;

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
  await expect(answerWindow(page)).toContainText("2003年の個人ホームページ");
  await waitForPage(page);

  await pageFrame(page)
    .locator("[anokoro-quiz-answer]")
    .click({ position: { x: 4, y: 4 } });
  await expect(result(page)).toContainText("正解！");
  await expect(result(page)).toContainText("2011年から");

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

  await frame.locator("a", { hasText: "メール" }).click();
  await expect(result(page)).toHaveText("ちがうようです（残り 2 回）");
  await expect(frame.locator("a", { hasText: "メール" })).toHaveAttribute("data-quiz-miss", "");
  await frame.locator("a", { hasText: "メール" }).click();
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
  await expect(answerWindow(page)).toContainText("1995年");
  await answerWindow(page).getByRole("button", { name: "ページではなく回線がおかしい" }).click();
  await expect(result(page)).toContainText("正解！");
  await expect(result(page)).toContainText("1995年にはまだ選べませんでした");

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

test("作成キットの 3 か所の入口から開く", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await page
    .getByRole("group", { name: "タイムマシン" })
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
  await expect(page).toHaveURL(/\/quiz\//);

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

test("作成キットへ戻るリンクは出題年のキットを開く", async ({ page }) => {
  await page.goto(`/quiz/?seed=${DISPLAY_SEED}`);
  await expect(page.getByRole("link", { name: "作成キットへ戻る" })).toHaveAttribute(
    "href",
    "/kit/?year=2003",
  );
});
