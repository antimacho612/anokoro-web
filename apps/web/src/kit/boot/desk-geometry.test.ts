import { describe, expect, test } from "vite-plus/test";
import {
  circle,
  deskPlane,
  mixColor,
  roundedRect,
  visibleSides,
  type Point,
} from "./desk-geometry.ts";

const signedArea = (points: readonly Point[]): number =>
  points.reduce((sum, [x0, y0], i) => {
    const [x1, y1] = points[(i + 1) % points.length]!;
    return sum + x0 * y1 - x1 * y0;
  }, 0);

const SQUARE: Point[] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];

test.each([
  ["roundedRect", roundedRect(40, 30, 6)],
  ["circle", circle(10)],
])("%s の輪郭は画面上で時計回り", (_, outline) => {
  expect(signedArea(outline)).toBeGreaterThan(0);
});

describe("deskPlane", () => {
  test("奥行きだけを縮めて写す", () => {
    const plane = deskPlane({ x: 100, y: 50, angleDeg: 0, squash: 0.5 });
    expect(plane.toScene(10, 20)).toEqual([110, 60]);
  });

  test("transform は at と同じ写し方になる", () => {
    const plane = deskPlane({ x: 3, y: 4, angleDeg: 30, squash: 0.4 });
    const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] =
      plane.transform.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    const [x, y] = plane.toScene(7, -5);
    expect(a * 7 + c * -5 + e).toBeCloseTo(x);
    expect(b * 7 + d * -5 + f).toBeCloseTo(y);
  });
});

describe("visibleSides", () => {
  test("真上から置いた四角では、手前の 1 面だけが見え、明かりには横向き", () => {
    const sides = visibleSides(SQUARE, 3);
    expect(sides).toHaveLength(1);
    expect(sides[0]!.points).toEqual([
      [10, 10],
      [0, 10],
      [0, 13],
      [10, 13],
    ]);
    expect(sides[0]!.lightCosine).toBeCloseTo(0);
  });

  test("輪郭の向きが逆でも、同じ面が見える", () => {
    expect(visibleSides(SQUARE.toReversed(), 3)).toHaveLength(1);
  });

  test("傾けて置くと、左を向いた面は明るく、右を向いた面は暗い", () => {
    const plane = deskPlane({ x: 0, y: 0, angleDeg: 20, squash: 0.5 });
    const sides = visibleSides(
      roundedRect(40, 30, 0).map(([u, v]) => plane.toScene(u, v)),
      4,
    );
    expect(sides).toHaveLength(2);
    const lights = sides.map((s) => s.lightCosine).toSorted((p, q) => p - q);
    expect(lights[0]).toBeLessThan(0);
    expect(lights[1]).toBeGreaterThan(0);
  });
});

describe("mixColor", () => {
  test("両端は元の色、中ほどは平均", () => {
    expect(mixColor("#000000", "#ffffff", 0)).toBe("#000000");
    expect(mixColor("#000000", "#ffffff", 1)).toBe("#ffffff");
    expect(mixColor("#204060", "#406080", 0.5)).toBe("#305070");
  });
});
