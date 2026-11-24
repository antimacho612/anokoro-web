import { describe, expect, it } from "vite-plus/test";
import { DEFAULT_YEAR, readYearParam, withYearParam } from "./year-param.ts";

describe("readYearParam", () => {
  it("既定は 1995 年", () => {
    expect(DEFAULT_YEAR).toBe(1995);
    expect(readYearParam("")).toBe(1995);
  });

  it("範囲内の年を読む", () => {
    expect(readYearParam("?year=2003")).toBe(2003);
    expect(readYearParam("?foo=1&year=2015")).toBe(2015);
  });

  it.each(["?year=1994", "?year=2016", "?year=abc", "?year=2003.5", "?year=+2003", "?year="])(
    "不正な値 %s は既定の年にする",
    (search) => {
      expect(readYearParam(search)).toBe(DEFAULT_YEAR);
    },
  );
});

describe("withYearParam", () => {
  it("ほかのクエリとハッシュを残して year を書き換える", () => {
    expect(withYearParam("https://example.com/kit/?a=1&year=1995#s=x", 2008)).toBe(
      "https://example.com/kit/?a=1&year=2008#s=x",
    );
  });
});
