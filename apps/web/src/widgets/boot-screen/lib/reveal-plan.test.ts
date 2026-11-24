import { describe, expect, test } from "vite-plus/test";
import { PHASE_MS } from "./boot-timeline.ts";
import {
  REVEAL_TIMING,
  isOnScreen,
  outlinesAt,
  readingOrder,
  revealSchedule,
  type Rect,
} from "./reveal-plan.ts";

const revealMs = PHASE_MS.revealDesktop;

describe("revealSchedule", () => {
  test.each([1, 3, 7, 20])("%i 枚のウィンドウでも、デスクトップの場面の中で出し終える", (n) => {
    const last = revealSchedule(n).at(-1)!;
    expect(last.showMsInReveal + REVEAL_TIMING.showMs).toBeLessThanOrEqual(revealMs);
  });

  test("順に少しずつ遅らせて開く", () => {
    const [a, b] = revealSchedule(2);
    expect(b!.startMsInReveal).toBeGreaterThan(a!.startMsInReveal);
    expect(a!.showMsInReveal).toBe(a!.startMsInReveal + REVEAL_TIMING.growMs);
  });
});

test("readingOrder は上から、同じ高さなら左から", () => {
  const rects: Rect[] = [
    { x: 500, y: 100, width: 10, height: 10 },
    { x: 0, y: 0, width: 10, height: 10 },
    { x: 0, y: 100, width: 10, height: 10 },
  ];
  expect(readingOrder(rects)).toEqual([1, 2, 0]);
});

test("isOnScreen は画面に少しでもかかっているものだけ", () => {
  expect(isOnScreen({ x: 10, y: 790, width: 100, height: 100 }, 1000, 800)).toBe(true);
  expect(isOnScreen({ x: 10, y: 900, width: 100, height: 100 }, 1000, 800)).toBe(false);
  expect(isOnScreen({ x: 10, y: 10, width: 0, height: 100 }, 1000, 800)).toBe(false);
});

describe("outlinesAt", () => {
  const origin: Rect = { x: 500, y: 400, width: 0, height: 0 };
  const target: Rect = { x: 0, y: 0, width: 300, height: 200 };
  const [step] = revealSchedule(1);

  test("始まる前と広がりきったあとは枠線を描かない", () => {
    expect(outlinesAt([target], [step!], origin, 0)).toEqual([]);
    expect(outlinesAt([target], [step!], origin, step!.showMsInReveal + 200)).toEqual([]);
  });

  test("origin から目的のウィンドウへ向かって広がり、残像が続く", () => {
    const frames = outlinesAt([target], [step!], origin, step!.startMsInReveal + 90);
    expect(frames.length).toBe(REVEAL_TIMING.trail);
    const [head, tail] = frames;
    expect(head!.rect.width).toBeGreaterThan(tail!.rect.width);
    expect(head!.rect.width).toBeLessThan(target.width);
    expect(head!.alpha).toBeGreaterThan(tail!.alpha);
  });
});
