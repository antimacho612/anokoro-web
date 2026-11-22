import { describe, expect, test } from "vite-plus/test";
import { isKiriban } from "./kiriban.ts";

describe("isKiriban", () => {
  test.each([100, 500, 1000, 2000, 90000, 111, 777, 1111, 99999, 1234, 12345, 123456789])(
    "%i はキリ番",
    (n) => expect(isKiriban(n)).toBe(true),
  );

  test.each([0, 7, 10, 50, 99, 110, 123, 774, 778, 1001, 1235, 2345, 1.5, -100, Number.NaN])(
    "%d はキリ番ではない",
    (n) => expect(isKiriban(n)).toBe(false),
  );
});
