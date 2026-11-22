import { MAX_YEAR, UI_THEMES } from "@anokoro/era-data";
import { describe, expect, test } from "vite-plus/test";
import { eraPalette, rgba } from "./era-palette.ts";

describe("eraPalette", () => {
  test("同じ外観の年の間では色が変わらない", () => {
    expect(eraPalette(1996.5)).toBe(eraPalette(1996));
  });

  test("外観が変わる年の境目では、前後の色を混ぜる", () => {
    const xp = UI_THEMES.find((t) => t.id === "blue-round")!.from;
    const before = eraPalette(xp - 1);
    const after = eraPalette(xp);
    const middle = eraPalette(xp - 0.5);
    for (let i = 0; i < 3; i++) {
      const lo = Math.min(before.glow[i]!, after.glow[i]!);
      const hi = Math.max(before.glow[i]!, after.glow[i]!);
      expect(middle.glow[i]).toBeGreaterThanOrEqual(lo);
      expect(middle.glow[i]).toBeLessThanOrEqual(hi);
    }
  });

  test("対象の年より後と、対象の年とで色が分かれる", () => {
    expect(eraPalette(MAX_YEAR + 3)).not.toEqual(eraPalette(MAX_YEAR));
  });

  test("対象の最初の年より前は、最初の年の色", () => {
    expect(eraPalette(1990)).toBe(eraPalette(1995));
  });
});

test("rgba は CSS の rgb() の書き方にする", () => {
  expect(rgba([1, 2, 3], 0.5)).toBe("rgb(1 2 3 / 0.5)");
});
