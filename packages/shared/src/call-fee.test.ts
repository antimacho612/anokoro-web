import { describe, expect, test } from "vite-plus/test";
import { callFee, formatHms, isTelehoTime } from "./call-fee.ts";

describe("callFee", () => {
  test.each([
    [0, 10],
    [1, 10],
    [180, 10],
    [181, 20],
    [3600, 200],
  ])("%i 秒は %i 円", (sec, yen) => expect(callFee(sec)).toBe(yen));
});

describe("isTelehoTime", () => {
  const at = (hour: number, minute = 0) => new Date(2003, 10, 18, hour, minute);

  test.each([23, 0, 3, 7])("%i 時は定額", (hour) => expect(isTelehoTime(at(hour))).toBe(true));
  test.each([8, 12, 22])("%i 時は従量", (hour) => expect(isTelehoTime(at(hour))).toBe(false));
  test("22:59 は従量、7:59 は定額", () => {
    expect(isTelehoTime(at(22, 59))).toBe(false);
    expect(isTelehoTime(at(7, 59))).toBe(true);
  });
});

describe("formatHms", () => {
  test.each([
    [0, "00:00:00"],
    [59.9, "00:00:59"],
    [61, "00:01:01"],
    [3725, "01:02:05"],
  ])("%d 秒は %s", (sec, text) => expect(formatHms(sec)).toBe(text));
});
