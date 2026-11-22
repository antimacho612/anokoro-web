import { describe, expect, test } from "vite-plus/test";
import { BOOT_SAMPLE_RATE, synthesizeBootSound } from "./boot-sound.ts";
import {
  calmTimeline,
  fullTimeline,
  journeyFor,
  phaseStartMs,
  totalMs,
  warpAccents,
} from "./boot-timeline.ts";

const timeline = fullTimeline(journeyFor(2003, 2026));
const full = (seed: number) => synthesizeBootSound({ timeline, seed });

function rms(samples: Float32Array, fromMs: number, toMs: number): number {
  const from = Math.floor((fromMs / 1000) * BOOT_SAMPLE_RATE);
  const to = Math.floor((toMs / 1000) * BOOT_SAMPLE_RATE);
  let sum = 0;
  for (let i = from; i < to; i++) sum += samples[i]! ** 2;
  return Math.sqrt(sum / (to - from));
}

describe("synthesizeBootSound", () => {
  test("演出と同じ長さの波形を作る", () => {
    expect(full(1).length).toBe(Math.ceil((totalMs(timeline) / 1000) * BOOT_SAMPLE_RATE));
  });

  test("すべての値が -1〜1 に収まる", () => {
    const samples = full(1);
    expect(samples.every((v) => Number.isFinite(v) && Math.abs(v) <= 1)).toBe(true);
  });

  test("同じシードなら同じ音、違うシードなら違う音", () => {
    expect(full(5)).toEqual(full(5));
    expect(full(5)).not.toEqual(full(6));
  });

  test("跳躍の間は、自己診断の間より音が大きい", () => {
    const post = phaseStartMs(timeline, "post")!;
    const warp = phaseStartMs(timeline, "warp")!;
    const arrive = phaseStartMs(timeline, "arrive")!;
    const samples = full(1);
    expect(rms(samples, warp, arrive)).toBeGreaterThan(rms(samples, post, post + 1000));
  });

  test("止まる年に入った瞬間は、止まっている間より音が大きい", () => {
    const samples = full(1);
    for (const accent of warpAccents(timeline).filter((a) => a.kind === "checkpoint")) {
      expect(rms(samples, accent.atMs, accent.atMs + 80)).toBeGreaterThan(
        rms(samples, accent.atMs + 200, accent.atMs + 280),
      );
    }
  });

  test("動きを減らす設定では、その短い流れに合わせた長さになる", () => {
    const calm = calmTimeline(journeyFor(2003, 2026));
    const samples = synthesizeBootSound({ timeline: calm, seed: 1 });
    expect(samples.length).toBe(Math.ceil((totalMs(calm) / 1000) * BOOT_SAMPLE_RATE));
    expect(samples.some((v) => v !== 0)).toBe(true);
  });
});
