import { MAX_YEAR, MIN_YEAR, YEARS } from "@anokoro/era-data";
import { describe, expect, test } from "vite-plus/test";
import {
  PHASE_MS,
  calmTimeline,
  checkpointYears,
  digitPosition,
  displayYear,
  durationSeconds,
  fullTimeline,
  journeyFor,
  phaseAt,
  phaseStartMs,
  totalMs,
  warpAccents,
  warpSpeed,
  yearAt,
  yearChangeTimes,
} from "./boot-timeline.ts";

const timelineTo = (to: number) => fullTimeline(journeyFor(to, 2026));

describe("場面の長さ", () => {
  test.each(YEARS)("%i 年へ向かう演出は 10 秒以内に収める", (to) => {
    expect(totalMs(timelineTo(to))).toBeLessThanOrEqual(10_000);
  });

  test("いちばん遠い年へ向かうときは、近い年より長い", () => {
    expect(totalMs(timelineTo(MIN_YEAR))).toBeGreaterThan(totalMs(timelineTo(MAX_YEAR)));
  });

  test("動きを減らす設定では 2.5 秒以内に終える", () => {
    expect(totalMs(calmTimeline(journeyFor(2003, 2026)))).toBeLessThanOrEqual(2500);
  });

  test("案内に出す長さは秒に丸める", () => {
    const timeline = timelineTo(2003);
    expect(durationSeconds(timeline)).toBe(Math.round(totalMs(timeline) / 1000));
  });

  test("経過時間から場面と進み具合を求め、最後のあとは done", () => {
    const timeline = timelineTo(2003);
    expect(phaseAt(timeline, 0)).toEqual({ id: "power", progress: 0, elapsedInPhase: 0 });
    expect(phaseAt(timeline, PHASE_MS.power + PHASE_MS.post / 2)).toMatchObject({
      id: "post",
      progress: 0.5,
    });
    expect(phaseAt(timeline, totalMs(timeline)).id).toBe("done");
  });
});

describe("跳躍の出発点", () => {
  test("今の年から出発する", () => {
    expect(journeyFor(2003, 2026)).toEqual({ from: 2026, to: 2003 });
  });

  test("端末の時計が対象の最終年以前でも、対象外の年から出発する", () => {
    expect(journeyFor(2003, 2010).from).toBe(MAX_YEAR + 1);
  });
});

describe("止まる年", () => {
  test("さかのぼる向きで外観が変わる年に止まる", () => {
    expect(checkpointYears(MIN_YEAR)).toEqual([2014, 2011, 2006, 2000]);
    expect(checkpointYears(2003)).toEqual([2014, 2011]);
  });

  test("行き先の近くでは止まらず、1 年ずつ送る", () => {
    expect(checkpointYears(2012)).toEqual([]);
  });

  test("止まっている間、年カウンターは止まる年ちょうどを指す", () => {
    const timeline = timelineTo(MIN_YEAR);
    for (const accent of warpAccents(timeline).filter((a) => a.kind === "checkpoint")) {
      expect(yearAt(timeline, accent.atMs + 1)).toBe(accent.year);
      expect(yearAt(timeline, accent.atMs + 200)).toBe(accent.year);
      expect(warpSpeed(timeline, accent.atMs + 100)).toBeLessThan(0.2);
    }
  });

  test("区切りは、対象の年への突入、止まる年、到着前の 1 年送りの順", () => {
    const accents = warpAccents(timelineTo(2003));
    expect(accents.map((a) => [a.kind, a.year])).toEqual([
      ["entry", MAX_YEAR],
      ["checkpoint", 2014],
      ["checkpoint", 2011],
      ["tick", 2005],
      ["tick", 2004],
    ]);
  });

  test("行き先が対象の最終年に近いときは、1 年送りの途中で対象の年に入る", () => {
    expect(warpAccents(timelineTo(2014)).map((a) => [a.kind, a.year])).toEqual([
      ["tick", 2016],
      ["entry", MAX_YEAR],
    ]);
  });
});

describe("年カウンター", () => {
  test.each([MIN_YEAR, 2003, 2014, MAX_YEAR])("%i 年へ向かうとき", (to) => {
    const timeline = timelineTo(to);
    const warpStart = phaseStartMs(timeline, "warp")!;
    const arriveStart = phaseStartMs(timeline, "arrive")!;

    expect(yearAt(timeline, 0)).toBe(2026);
    expect(yearAt(timeline, warpStart - 1)).toBe(2026);

    let prev = Number.POSITIVE_INFINITY;
    for (let t = warpStart; t < arriveStart; t += 5) {
      const value = yearAt(timeline, t);
      expect(value).toBeLessThanOrEqual(prev);
      prev = value;
    }
    expect(yearAt(timeline, arriveStart - 0.01)).toBeCloseTo(to, 1);

    for (let t = arriveStart; t < arriveStart + PHASE_MS.arrive; t += 5) {
      expect(displayYear(yearAt(timeline, t))).toBe(to);
    }
    expect(yearAt(timeline, totalMs(timeline))).toBe(to);
  });

  test("動きを減らす設定では、はじめから行き先の年", () => {
    expect(yearAt(calmTimeline(journeyFor(1995, 2026)), 0)).toBe(1995);
  });

  test("通り過ぎる年を 1 年ずつ、ちょうど 1 回だけ数える", () => {
    const changes = yearChangeTimes(timelineTo(1995));
    expect(changes.map((c) => c.year)).toEqual(
      Array.from({ length: 2026 - 1995 }, (_, i) => 2025 - i),
    );
  });
});

describe("回転式カウンターの桁", () => {
  test("一の位は連続して回る", () => {
    expect(digitPosition(2003, 0)).toBe(3);
    expect(digitPosition(2003.25, 0)).toBeCloseTo(3.25);
  });

  test("上の桁は、下の桁が 9 から 0 へ回る間だけ動く", () => {
    expect(digitPosition(2003.5, 1)).toBe(0);
    expect(digitPosition(2009.5, 1)).toBeCloseTo(0.5);
    expect(digitPosition(1999.5, 3)).toBeCloseTo(1.5);
    expect(digitPosition(1999.5, 2)).toBeCloseTo(9.5);
  });
});
