import { describe, expect, test } from "vite-plus/test";
import {
  MAX_PAGES,
  MAX_PAGE_BYTES,
  categorySchema,
  genreSchema,
  sitePagesSchema,
  utf8Bytes,
} from "./site.ts";

const page = (path: string, html = "<html></html>") => ({ path, html });

describe("sitePagesSchema", () => {
  test("正しいページを通す", () => {
    expect(sitePagesSchema.safeParse([page("index.html"), page("diary_2.html")]).success).toBe(
      true,
    );
  });

  test.each(["Index.html", "../a.html", "a.htm", "a b.html", `${"a".repeat(33)}.html`])(
    "ページ名 %s を拒む",
    (path) => {
      expect(sitePagesSchema.safeParse([page(path)]).success).toBe(false);
    },
  );

  test("空、重複、ページ数の超過を拒む", () => {
    expect(sitePagesSchema.safeParse([]).success).toBe(false);
    expect(sitePagesSchema.safeParse([page("a.html"), page("a.html")]).success).toBe(false);
    const many = Array.from({ length: MAX_PAGES + 1 }, (_, i) => page(`p${i}.html`));
    expect(sitePagesSchema.safeParse(many).success).toBe(false);
  });

  test("1 ページ 100KB、合計 1MB を超えると拒む", () => {
    const big = "あ".repeat(Math.floor(MAX_PAGE_BYTES / 3) + 1);
    expect(utf8Bytes(big)).toBeGreaterThan(MAX_PAGE_BYTES);
    expect(sitePagesSchema.safeParse([page("a.html", big)]).success).toBe(false);
    const nearMax = "a".repeat(MAX_PAGE_BYTES);
    const pages = Array.from({ length: 11 }, (_, i) => page(`p${i}.html`, nearMax));
    expect(sitePagesSchema.safeParse(pages).success).toBe(false);
  });
});

describe("種類とカテゴリ", () => {
  test("未知の値は既定に読み替える", () => {
    expect(genreSchema.parse("blog")).toBe("blog");
    expect(genreSchema.parse("sns")).toBe("personal");
    expect(categorySchema.parse("game")).toBe("game");
    expect(categorySchema.parse("toString")).toBe("other");
  });
});
