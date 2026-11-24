import { describe, expect, test } from "vite-plus/test";
import { siteUsageBytes } from "./site-usage.ts";

const page = (path: string, html: string) => ({ path, html });

describe("siteUsageBytes", () => {
  test("全ページの HTML のバイト数を足す", () => {
    expect(siteUsageBytes([page("index.html", "あ"), page("a.html", "abc")], 2000)).toBe(6);
  });

  test("素材の疑似バイト数を、同じ素材は 1 回だけ足す", () => {
    const top = '<img src="new.gif"><img src="new.gif">';
    const sub = '<body background="kabe1.gif"><img src="NEW.GIF">';
    const html = new TextEncoder().encode(top + sub).length;
    expect(siteUsageBytes([page("index.html", top), page("a.html", sub)], 2000)).toBe(
      html + 1100 + 3800,
    );
  });

  test("見つからない画像は数えない", () => {
    const html = '<img src="nothing.gif">';
    expect(siteUsageBytes([page("index.html", html)], 2000)).toBe(html.length);
  });
});
