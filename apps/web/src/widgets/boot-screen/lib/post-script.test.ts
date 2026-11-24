import { MAX_YEAR, MIN_YEAR } from "@anokoro/era-data";
import { expect, test } from "vite-plus/test";
import { PHASE_MS, journeyFor } from "./boot-timeline.ts";
import { memoryText, postLines } from "./post-script.ts";

const postMs = PHASE_MS.selfTest;
const lines = postLines(journeyFor(2003, 2026));

test("自己診断の行は、自己診断の場面の中で出し終える", () => {
  for (const line of lines) {
    expect(line.atMsInSelfTest).toBeLessThan(postMs);
    if (line.result) expect(line.result.atMsInSelfTest).toBeLessThan(postMs);
  }
});

test("行は上から順に出る", () => {
  const times = lines.map((l) => l.atMsInSelfTest);
  expect(times).toEqual(times.toSorted((a, b) => a - b));
});

test("行き先の年を強調してから、跳躍の合図を出す", () => {
  const dest = lines.find((l) => l.tone === "highlightedDestination");
  const go = lines.find((l) => l.tone === "warpCue");
  expect(dest?.value).toBe("2003 年");
  expect(go!.atMsInSelfTest - dest!.atMsInSelfTest).toBeGreaterThanOrEqual(200);
});

test("思い出メモリは対象の最初の年から最終年まで数え上げる", () => {
  expect(memoryText(0)).toBe(`${MIN_YEAR}〜${MIN_YEAR} 年`);
  expect(memoryText(postMs)).toBe(`${MIN_YEAR}〜${MAX_YEAR} 年`);
});
