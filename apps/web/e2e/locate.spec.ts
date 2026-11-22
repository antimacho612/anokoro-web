import { expect, test } from "@playwright/test";

test("警告の文言をクリックすると、メモ帳の該当行にカーソルが移る", async ({ page }) => {
  await page.goto("/kit/?year=2003");
  const notepad = page.getByRole("textbox", { name: "HTML" });
  const filler = Array.from({ length: 60 }, (_, i) => `<p>${i + 1}</p>`).join("\n");
  const source = `${filler}\n  <section>新しいタグ</section>\n`;
  await notepad.fill(source);

  await page
    .getByRole("region", { name: /^時代チェッカー/ })
    .getByRole("listitem")
    .filter({ hasText: "<section>" })
    .getByRole("button", { name: /<section>/ })
    .click();

  await expect(notepad).toBeFocused();
  const caret = await notepad.evaluate((el: HTMLTextAreaElement) => ({
    start: el.selectionStart,
    end: el.selectionEnd,
    scrolled: el.scrollTop > 0,
  }));
  const expected = filler.length + 1 + 2;
  expect(caret).toEqual({ start: expected, end: expected, scrolled: true });
});
