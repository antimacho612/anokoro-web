import { describe, expect, test } from "vite-plus/test";
import { deskPlane, mixColor, roundedRect, visibleSides, type Point } from "./desk-geometry.ts";

const SQUARE: Point[] = [
  [0, 0],
  [10, 0],
  [10, 10],
  [0, 10],
];

describe("deskPlane", () => {
  test("奥行きだけを縮めて写す", () => {
    const plane = deskPlane({ x: 100, y: 50, angle: 0, squash: 0.5 });
    expect(plane.at(10, 20)).toEqual([110, 60]);
  });

  test("transform は at と同じ写し方になる", () => {
    const plane = deskPlane({ x: 3, y: 4, angle: 30, squash: 0.4 });
    const [a = 0, b = 0, c = 0, d = 0, e = 0, f = 0] =
      plane.transform.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
    const [x, y] = plane.at(7, -5);
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
    expect(sides[0]!.light).toBeCloseTo(0);
  });

  test("輪郭の向きが逆でも、同じ面が見える", () => {
    expect(visibleSides(SQUARE.toReversed(), 3)).toHaveLength(1);
  });

  test("傾けて置くと、左を向いた面は明るく、右を向いた面は暗い", () => {
    const plane = deskPlane({ x: 0, y: 0, angle: 20, squash: 0.5 });
    const sides = visibleSides(
      roundedRect(40, 30, 0).map(([u, v]) => plane.at(u, v)),
      4,
    );
    expect(sides).toHaveLength(2);
    const lights = sides.map((s) => s.light).toSorted((p, q) => p - q);
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
