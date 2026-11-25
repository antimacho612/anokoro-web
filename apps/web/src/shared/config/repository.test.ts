import { expect, test } from "vite-plus/test";
import { newIssueUrl } from "./repository.ts";

test("テンプレートと、年と画面の初期値だけを付ける", () => {
  const url = new URL(newIssueUrl("era-accuracy", { year: 1999, screen: "kit" }));
  expect(url.origin + url.pathname).toBe("https://github.com/antimacho612/anokoro-web/issues/new");
  expect(Object.fromEntries(url.searchParams)).toEqual({
    template: "era-accuracy.yml",
    year: "1999",
    screen: "作成キット",
  });
});
