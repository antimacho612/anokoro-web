import { describe, expect, test } from "vite-plus/test";
import { createRandom } from "./random.ts";

describe("createRandom", () => {
  test("同じシードなら同じ列を返す", () => {
    const a = createRandom(42);
    const b = createRandom(42);
    expect(Array.from({ length: 100 }, a)).toEqual(Array.from({ length: 100 }, b));
  });

  test("違うシードなら違う列を返す", () => {
    const a = createRandom(1);
    const b = createRandom(2);
    expect(Array.from({ length: 10 }, a)).not.toEqual(Array.from({ length: 10 }, b));
  });

  test("0 以上 1 未満の値を返す", () => {
    const random = createRandom(7);
    for (let i = 0; i < 10000; i++) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
