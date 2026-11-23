import { describe, expect, test } from "vite-plus/test";
import {
  canGoBack,
  canGoForward,
  currentEntry,
  goBack,
  goForward,
  pushHistory,
  renameInHistory,
  startHistory,
} from "./browser-history.ts";
import { resolveLink } from "./link-target.ts";

const pages = new Set(["index.html", "diary.html"]);
const resolve = (href: string, currentPath = "index.html") =>
  resolveLink({
    href,
    currentPath,
    hasPage: (p) => pages.has(p),
    siteRoot: "http://www.hogespace.example/~you/",
  });

describe("resolveLink", () => {
  test.each([
    ["diary.html", { kind: "page", path: "diary.html" }],
    ["./diary.html", { kind: "page", path: "diary.html" }],
    ["DIARY.html", { kind: "page", path: "diary.html" }],
    ["diary.html#top", { kind: "page", path: "diary.html" }],
    ["diary.html?x=1", { kind: "page", path: "diary.html" }],
    ["../index.html", { kind: "page", path: "index.html" }],
    ["/", { kind: "page", path: "index.html" }],
    ["#menu", { kind: "hash" }],
    ["mailto:taro@example.com", { kind: "mailto" }],
    ["", { kind: "none" }],
    ["javascript:alert(1)", { kind: "none" }],
  ])("%s", (href, expected) => {
    expect(resolve(href)).toEqual(expected);
  });

  test("ないページは疑似 URL で返す", () => {
    expect(resolve("bbs.html")).toEqual({
      kind: "missing",
      url: "http://www.hogespace.example/~you/bbs.html",
    });
  });

  test("サイトの外は開けない", () => {
    expect(resolve("http://www.example.com/")).toEqual({
      kind: "external",
      url: "http://www.example.com/",
    });
    expect(resolve("//evil.example/")).toEqual({ kind: "external", url: "//evil.example/" });
  });
});

describe("履歴", () => {
  const top = { kind: "page", path: "index.html" } as const;
  const diary = { kind: "page", path: "diary.html" } as const;
  const missing = { kind: "missing", url: "http://x/" } as const;

  test("戻ると進む", () => {
    let h = startHistory(top);
    expect(canGoBack(h)).toBe(false);
    h = pushHistory(h, diary);
    h = pushHistory(h, missing);
    h = goBack(h);
    expect(currentEntry(h)).toEqual(diary);
    expect(canGoForward(h)).toBe(true);
    h = goForward(h);
    expect(currentEntry(h)).toEqual(missing);
    expect(goForward(h)).toBe(h);
  });

  test("戻ってから開くと、進む側を捨てる", () => {
    let h = pushHistory(pushHistory(startHistory(top), diary), missing);
    h = pushHistory(goBack(goBack(h)), diary);
    expect(h.entries).toEqual([top, diary]);
    expect(canGoForward(h)).toBe(false);
  });

  test("今と同じ場所は積まない", () => {
    const h = startHistory(top);
    expect(pushHistory(h, top)).toBe(h);
  });

  test("名前を変えたページを置き換える", () => {
    const h = renameInHistory(pushHistory(startHistory(top), diary), "diary.html", "nikki.html");
    expect(h.entries).toEqual([top, { kind: "page", path: "nikki.html" }]);
  });
});
