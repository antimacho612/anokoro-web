import { describe, expect, test } from "vite-plus/test";
import { MODEM_SEGMENTS, SAMPLE_RATE, synthesizeModemSound } from "./synthesize.ts";

const totalSec = (names: string[]) =>
  MODEM_SEGMENTS.filter((s) => names.some((n) => s.name.startsWith(n))).reduce(
    (sum, s) => sum + s.durationSec,
    0,
  );

function segmentRange(name: string): [number, number] {
  let offset = 0;
  for (const segment of MODEM_SEGMENTS) {
    const length = Math.floor(segment.durationSec * SAMPLE_RATE);
    if (segment.name === name) return [offset, offset + length];
    offset += length;
  }
  throw new Error(`区間がない: ${name}`);
}

describe("MODEM_SEGMENTS", () => {
  test("各区間の長さ", () => {
    expect(totalSec(["発信音"])).toBeCloseTo(0.7);
    expect(totalSec(["呼び出し音"])).toBeCloseTo(1.0);
    expect(totalSec(["応答音"])).toBeCloseTo(1.3);
    expect(totalSec(["ネゴシエーション"])).toBeCloseTo(0.9);
    expect(totalSec(["回線プローブ"])).toBeCloseTo(0.6);
    expect(totalSec(["トレーニング"])).toBeCloseTo(2.2);
  });

  test("プッシュ音は 10 桁、各桁 80ms、間隔 60ms", () => {
    const index = MODEM_SEGMENTS.findIndex((s) => s.name.startsWith("プッシュ音"));
    const dtmf = MODEM_SEGMENTS.slice(index, index + 20);
    expect(dtmf.filter((s) => s.name.startsWith("プッシュ音"))).toHaveLength(10);
    dtmf.forEach((s, i) => expect(s.durationSec).toBe(i % 2 === 0 ? 0.08 : 0.06));
    expect(dtmf.reduce((sum, s) => sum + s.durationSec, 0)).toBeCloseTo(1.4);
  });

  test("合計は 8.9 秒", () => {
    expect(MODEM_SEGMENTS.reduce((sum, s) => sum + s.durationSec, 0)).toBeCloseTo(8.9);
  });
});

describe("synthesizeModemSound", () => {
  const samples = synthesizeModemSound({ seed: 1 });

  test("長さは各区間のサンプル数の合計", () => {
    const expected = MODEM_SEGMENTS.reduce(
      (sum, s) => sum + Math.floor(s.durationSec * SAMPLE_RATE),
      0,
    );
    expect(samples.length).toBe(expected);
  });

  test("振幅は -1 から 1 の範囲に収まる", () => {
    let peak = 0;
    for (const v of samples) peak = Math.max(peak, Math.abs(v));
    expect(peak).toBeLessThanOrEqual(1);
    expect(peak).toBeGreaterThan(0.1);
  });

  test("同じシードなら同じ波形になる", () => {
    expect(synthesizeModemSound({ seed: 1 })).toEqual(samples);
  });

  test("シードが違うと乱数を使う区間だけが変わる", () => {
    const other = synthesizeModemSound({ seed: 2 });
    const [negotiationStart, negotiationEnd] = segmentRange("ネゴシエーション");
    const [trainingStart] = segmentRange("トレーニング");
    expect(other.subarray(0, negotiationStart)).toEqual(samples.subarray(0, negotiationStart));
    expect(other.subarray(negotiationStart, negotiationEnd)).not.toEqual(
      samples.subarray(negotiationStart, negotiationEnd),
    );
    expect(other.subarray(trainingStart)).not.toEqual(samples.subarray(trainingStart));
  });

  test("無音の区間は 0", () => {
    const index = MODEM_SEGMENTS.findIndex((s) => s.name === "無音");
    let offset = 0;
    for (const s of MODEM_SEGMENTS.slice(0, index))
      offset += Math.floor(s.durationSec * SAMPLE_RATE);
    const length = Math.floor(MODEM_SEGMENTS[index]!.durationSec * SAMPLE_RATE);
    expect(samples.subarray(offset, offset + length).every((v) => v === 0)).toBe(true);
  });

  test("トレーニングの最後はフェードアウトして 0 に近づく", () => {
    const tail = samples.subarray(samples.length - 10);
    for (const v of tail) expect(Math.abs(v)).toBeLessThan(0.01);
  });

  test("サンプリング周波数を変えると長さが変わる", () => {
    const half = synthesizeModemSound({ seed: 1, sampleRate: SAMPLE_RATE / 2 });
    expect(half.length).toBeLessThan(samples.length);
    expect(half.length).toBeGreaterThan(samples.length / 2 - MODEM_SEGMENTS.length);
  });
});
