import { describe, expect, it } from "vite-plus/test";
import { ManualClock } from "./clock.ts";

describe("ManualClock", () => {
  it("進めた分だけ期限の来たタイマーを時刻順に実行する", () => {
    const clock = new ManualClock();
    const log: string[] = [];
    clock.setTimeout(() => log.push(`b@${clock.now()}`), 200);
    clock.setTimeout(() => log.push(`a@${clock.now()}`), 100);
    clock.setTimeout(() => log.push(`a2@${clock.now()}`), 100);
    clock.advance(150);
    expect(log).toEqual(["a@100", "a2@100"]);
    expect(clock.now()).toBe(150);
    clock.advance(50);
    expect(log).toEqual(["a@100", "a2@100", "b@200"]);
  });

  it("タイマーの中で登録したタイマーも実行する", () => {
    const clock = new ManualClock();
    const log: number[] = [];
    clock.setTimeout(() => {
      log.push(clock.now());
      clock.setTimeout(() => log.push(clock.now()), 100);
    }, 100);
    clock.runAll();
    expect(log).toEqual([100, 200]);
  });

  it("取り消したタイマーは実行しない", () => {
    const clock = new ManualClock();
    let called = false;
    const id = clock.setTimeout(() => (called = true), 100);
    clock.clearTimeout(id);
    clock.runAll();
    expect(called).toBe(false);
  });
});
