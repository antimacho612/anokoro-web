import { describe, expect, it } from "vite-plus/test";
import { findResolution, resolutionAfterYearChange } from "./resolution.ts";

describe("resolutionAfterYearChange", () => {
  it("同じ期の中で年を変えても、選んだ解像度を保つ", () => {
    expect(resolutionAfterYearChange(1999, 2003, { width: 1024, height: 768 })).toEqual({
      width: 1024,
      height: 768,
    });
  });

  it("期が変わったら、その期の既定値に戻す", () => {
    expect(resolutionAfterYearChange(2003, 2004, { width: 640, height: 480 })).toEqual({
      width: 1024,
      height: 768,
    });
    expect(resolutionAfterYearChange(1999, 1998, { width: 1024, height: 768 })).toEqual({
      width: 640,
      height: 480,
    });
  });
});

describe("findResolution", () => {
  it("その年の候補だけを受け付ける", () => {
    expect(findResolution(2003, "800x600")).toEqual({ width: 800, height: 600 });
    expect(findResolution(1995, "1024x768")).toBeUndefined();
    expect(findResolution(2003, "800×600")).toBeUndefined();
  });
});
