import {
  FEATURES,
  MAX_YEAR,
  MIN_YEAR,
  YEARS,
  clampYear,
  featureStatus,
  type Year,
} from "@anokoro/era-data";
import { describe, expect, test } from "vite-plus/test";
import {
  planFragments,
  tokensForYear,
  tokensIntroducedIn,
  type FragmentToken,
} from "./boot-fragments.ts";
import {
  reducedMotionTimeline,
  displayYear,
  fullTimeline,
  journeyFor,
  phaseStartMs,
  yearValueAt,
} from "./boot-timeline.ts";

const texts = (tokens: FragmentToken[]) =>
  tokens.map((t) => (t.kind === "image" ? t.asset : t.text));

describe("その年のもの", () => {
  test("その年に使える機能だけを出す", () => {
    expect(texts(tokensForYear(1997))).toContain("<marquee>");
    expect(texts(tokensForYear(1997))).not.toContain("border-radius");
    expect(texts(tokensForYear(2012))).toContain("border-radius");
  });

  test("古い書き方になった機能は出さない", () => {
    expect(featureStatus("html.marquee", 2010)).toBe("outdated");
    expect(texts(tokensForYear(2010))).not.toContain("<marquee>");
  });

  test("回線と解像度は、その年の年表から出す", () => {
    expect(texts(tokensForYear(1995))).toEqual(expect.arrayContaining(["28.8kモデム", "640×480"]));
    expect(texts(tokensForYear(2015))).not.toContain("28.8kモデム");
  });

  test.each(YEARS)("%i 年にも 1 つ以上ある", (year) => {
    expect(tokensForYear(year).length).toBeGreaterThan(0);
  });

  test("その年に新しく出てきたものは、その年に使われていたものに含まれる", () => {
    for (const year of YEARS) {
      const current = texts(tokensForYear(year));
      for (const text of texts(tokensIntroducedIn(year))) expect(current).toContain(text);
    }
  });

  test("新しく出てきたものの年は機能年表に合わせる", () => {
    const year = FEATURES["html5.video"].availableFrom!;
    expect(texts(tokensIntroducedIn(year))).toContain("<video>");
    expect(texts(tokensIntroducedIn(clampYear(year - 1)))).not.toContain("<video>");
  });
});

describe("planFragments", () => {
  const timelineTo = (to: Year) => fullTimeline(journeyFor(to, 2026));

  test.each<Year>([MIN_YEAR, 2003, MAX_YEAR])("%i 年へ向かうときも、飛んでくるものがある", (to) => {
    expect(planFragments(timelineTo(to), 1).length).toBeGreaterThan(5);
  });

  test.each<Year>([MIN_YEAR, 2003, MAX_YEAR])(
    "%i 年へ向かうとき、飛び出した時点の年（対象の最終年より後は最終年）に使われていたものだけを出す",
    (to) => {
      const timeline = timelineTo(to);
      const warpStart = phaseStartMs(timeline, "warp")!;
      const arriveStart = phaseStartMs(timeline, "arrive")!;
      for (const f of planFragments(timeline, 7)) {
        expect(f.atMsFromBoot).toBeGreaterThanOrEqual(warpStart);
        expect(f.atMsFromBoot).toBeLessThan(arriveStart);
        expect(f.year).toBe(Math.min(displayYear(yearValueAt(timeline, f.atMsFromBoot)), MAX_YEAR));
        expect(f.year).toBeGreaterThanOrEqual(MIN_YEAR);
        expect(f.year).toBeLessThanOrEqual(MAX_YEAR);
        if (f.token.kind === "image" || f.token.kind === "counter") continue;
        expect(texts(tokensForYear(f.year))).toContain(f.token.text);
      }
    },
  );

  test.each<Year>([MIN_YEAR, 2003, MAX_YEAR])(
    "%i 年へ向かうとき、跳躍の最後の 1 割には新しく出さない",
    (to) => {
      const timeline = timelineTo(to);
      const warpStart = phaseStartMs(timeline, "warp")!;
      const arriveStart = phaseStartMs(timeline, "arrive")!;
      const last = planFragments(timeline, 7).at(-1)!;
      expect(last.atMsFromBoot).toBeLessThan(warpStart + (arriveStart - warpStart) * 0.9);
    },
  );

  test("同じシードなら同じ予定になる", () => {
    const timeline = timelineTo(1999);
    expect(planFragments(timeline, 42)).toEqual(planFragments(timeline, 42));
    expect(planFragments(timeline, 42)).not.toEqual(planFragments(timeline, 43));
  });

  test("跳躍のない流れでは何も飛ばさない", () => {
    expect(planFragments(reducedMotionTimeline(journeyFor(2003, 2026)), 1)).toEqual([]);
  });
});
