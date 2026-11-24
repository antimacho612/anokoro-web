import { test as base, expect, type Page } from "@playwright/test";
import { BOOTED_KEY } from "../src/entities/boot/model/boot-session.ts";
import { ONBOARDING_STEPS } from "../src/features/onboarding/model/onboarding-steps.ts";

const test = base.extend({
  context: async ({ context }, use) => {
    await context.addInitScript((key) => window.sessionStorage.setItem(key, "1"), BOOTED_KEY);
    await use(context);
  },
});

const tour = (page: Page) => page.locator("[data-onboarding] [role=dialog]");
const tourButton = (page: Page, name: string) => tour(page).getByRole("button", { name });
const taskbarButton = (page: Page, name: string) =>
  page.getByRole("navigation", { name: "タスクバー" }).getByRole("button", { name });

test("はじめて開くと、ウィンドウを順に案内し、最後まで進められる", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await expect(page.getByRole("dialog", { name: "あのころ Web へようこそ" })).toBeFocused();
  await expect(tour(page).getByLabel(`${ONBOARDING_STEPS.length} 手順中 1 番目`)).toBeVisible();
  await expect(tour(page)).toContainText("2003 年に到着");
  await expect(tourButton(page, "戻る")).toHaveCount(0);

  for (const step of ONBOARDING_STEPS.slice(1)) {
    await tourButton(page, "次へ").click();
    await expect(page.getByRole("dialog", { name: step.title })).toBeFocused();
  }
  await expect(tourButton(page, "次へ")).toHaveCount(0);
  await tourButton(page, "戻る").click();
  await expect(page.getByRole("dialog", { name: "当時の回線で読み込む" })).toBeVisible();
  await tourButton(page, "次へ").click();

  await tourButton(page, "はじめる").click();
  await expect(tour(page)).toHaveCount(0);
  await expect(page.locator("textarea").first()).toBeFocused();
});

test("1 文字ずつ打ち出す間も、吹き出しの大きさと読み上げる本文は変わらない", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const full = ONBOARDING_STEPS[0]?.body ?? "";
  const body = page
    .getByRole("dialog", { name: "あのころ Web へようこそ" })
    .locator("p")
    .filter({ hasText: full });
  const snapshot = () =>
    body.evaluate((el) => ({
      isTyping: el.querySelector("[aria-hidden=true]") !== null,
      text: el.textContent,
      width: el.getBoundingClientRect().width,
      height: el.getBoundingClientRect().height,
    }));

  await expect(body.locator("[aria-hidden=true]")).toHaveCount(1);
  const typing = await snapshot();
  await expect(body.locator("[aria-hidden=true]")).toHaveCount(0);
  const typed = await snapshot();

  expect(typing).toMatchObject({ isTyping: true, text: full });
  expect(typed).toEqual({ ...typing, isTyping: false });
});

test("Esc でとばすと、同じタブでは二度と出さない", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await expect(tour(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tour(page)).toHaveCount(0);

  await page.reload();
  await expect(taskbarButton(page, "使い方")).toBeVisible();
  await expect(tour(page)).toHaveCount(0);
});

test("新しいタブでは出し直すが、「次回から表示しない」を選ぶと出さない", async ({ context }) => {
  const first = await context.newPage();
  await first.goto("/kit/?year=2003");
  await tourButton(first, "スキップ").click();
  await expect(tour(first)).toHaveCount(0);

  const second = await context.newPage();
  await second.goto("/kit/?year=2003");
  await expect(tour(second)).toBeVisible();
  for (let i = 1; i < ONBOARDING_STEPS.length; i++) await tourButton(second, "次へ").click();
  await tour(second).getByRole("checkbox", { name: "次回から表示しない" }).check();
  await tourButton(second, "はじめる").click();

  const third = await context.newPage();
  await third.goto("/kit/?year=2003");
  await expect(taskbarButton(third, "使い方")).toBeVisible();
  await expect(tour(third)).toHaveCount(0);
});

test("「使い方」から見直せて、閉じると「使い方」のボタンへフォーカスを戻す", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await page.keyboard.press("Escape");
  await expect(tour(page)).toHaveCount(0);

  await taskbarButton(page, "使い方").click();
  await page.getByRole("button", { name: "ツアーをもう一度見る" }).click();
  await expect(page.getByRole("dialog", { name: "使い方 - あのころ Web" })).toHaveCount(0);
  await expect(page.getByRole("dialog", { name: "あのころ Web へようこそ" })).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(tour(page)).toHaveCount(0);
  await expect(taskbarButton(page, "使い方")).toBeFocused();
});

test("見本サイトをキットに取り込んで移ってきたときも出す", async ({ page }) => {
  await page.goto("/view/?sample=blog");
  await page.getByRole("button", { name: "キットに取り込む" }).click();
  await expect(page).toHaveURL(/\/kit\/$/);
  await expect(page.getByRole("dialog", { name: "あのころ Web へようこそ" })).toBeVisible();
});

test("幅が狭いと、案内しているウィンドウを画面に入れ、吹き出しを下端に置く", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/kit/?year=2003");
  await tourButton(page, "次へ").click();
  await tourButton(page, "次へ").click();
  await expect(page.getByRole("dialog", { name: "HTML を書く" })).toBeVisible();

  await expect(async () => {
    const bubble = await tour(page).boundingBox();
    expect(bubble).not.toBeNull();
    expect(Math.round((bubble?.y ?? 0) + (bubble?.height ?? 0))).toBe(800 - 12);
    const notepadTop = await page
      .locator("textarea")
      .first()
      .evaluate((el) => el.getBoundingClientRect().top);
    expect(notepadTop).toBeGreaterThan(0);
    expect(notepadTop).toBeLessThan(800);
  }).toPass();
});
