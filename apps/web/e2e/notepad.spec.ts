import { expect, test } from "./fixtures.ts";

test("メモ帳の「表示(V)」で文字の大きさを変え、次に開いたときも保つ", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const notepad = page.getByRole("region", { name: "index.html - メモ帳" });
  const textarea = notepad.getByRole("textbox", { name: "HTML" });
  await expect(textarea).toHaveCSS("font-size", "13px");

  await notepad.getByRole("button", { name: "表示(V)" }).click();
  await expect(page.getByRole("menuitemradio", { name: "文字の大きさ：中" })).toHaveAttribute(
    "aria-checked",
    "true",
  );
  await page.getByRole("menuitemradio", { name: "文字の大きさ：小" }).click();
  await expect(textarea).toHaveCSS("font-size", "11px");
  await expect(page.getByRole("menu", { name: "表示" })).toHaveCount(0);

  await page.reload();
  await expect(
    page
      .getByRole("region", { name: "index.html - メモ帳" })
      .getByRole("textbox", { name: "HTML" }),
  ).toHaveCSS("font-size", "11px");
});
