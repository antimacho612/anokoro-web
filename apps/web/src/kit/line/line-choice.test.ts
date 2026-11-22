import { describe, expect, it } from "vite-plus/test";
import { isLineSelectable, lineAfterYearChange } from "./line-choice.ts";

describe("isLineSelectable", () => {
  it("その年に選べる回線だけを true にする", () => {
    expect(isLineSelectable(1995, "isdn")).toBe(true);
    expect(isLineSelectable(1997, "m56")).toBe(false);
    expect(isLineSelectable(2001, "hikari")).toBe(true);
  });
});

describe("lineAfterYearChange", () => {
  it("既定の回線が同じ年どうしなら、選んだ回線を保つ", () => {
    expect(lineAfterYearChange(2003, 2005, "isdn")).toBe("isdn");
  });

  it("既定の回線が変わる年へ動いたら、その年の既定にする", () => {
    expect(lineAfterYearChange(2006, 2007, "isdn")).toBe("hikari");
    expect(lineAfterYearChange(1999, 1997, "m56")).toBe("m28");
  });
});
