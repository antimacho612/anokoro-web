import { expect, test, type Page } from "@playwright/test";

const bootScreen = (page: Page) => page.getByRole("dialog", { name: "あのころ Web の起動" });
const powerButton = (page: Page) => bootScreen(page).getByRole("button", { name: "電源を入れる" });

test("はじめて開くと、サイトの説明と行き先の年とともに電源ボタンを出す", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await expect(bootScreen(page)).toContainText("1995〜2015 年の日本の Web");
  await expect(bootScreen(page)).toContainText("電源を入れると 2003 年のパソコンが起動します");
  await expect(powerButton(page)).toBeFocused();
});

test("Esc で起動をとばすと、同じタブでは二度と出さない", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  await expect(powerButton(page)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(bootScreen(page)).toHaveCount(0);

  await page.reload();
  await expect(page.getByRole("navigation", { name: "タスクバー" })).toBeVisible();
  await expect(bootScreen(page)).toHaveCount(0);
});

test("効果音を切って起動すると、回線の接続音も切れた状態でキットが開く", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/kit/?year=2003");
  const sound = bootScreen(page).getByRole("switch", { name: "効果音" });
  if (await sound.isChecked()) await sound.click();
  await powerButton(page).click();

  await expect(bootScreen(page)).toContainText("2003 年に到着");
  await expect(bootScreen(page)).toHaveCount(0, { timeout: 5000 });
  await expect(page.getByRole("checkbox", { name: "接続音を鳴らす" })).not.toBeChecked();
});
