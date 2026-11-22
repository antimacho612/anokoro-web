import { describe, expect, it } from "vite-plus/test";
import { ManualClock } from "./clock.ts";
import { dial, type DialStep } from "./dial.ts";

function start(kind: "modem" | "isdn") {
  const clock = new ManualClock();
  const steps: [number, string][] = [];
  const handle = dial({
    kind,
    clock,
    onStep: (s: DialStep) => steps.push([clock.now(), s.message]),
  });
  return { clock, steps, handle };
}

describe("dial", () => {
  it("モデムは 10,800ms で接続済みになる", async () => {
    const { clock, steps, handle } = start("modem");
    clock.advance(10799);
    expect(steps.map(([at]) => at)).toEqual([0, 2550, 3750, 8900, 9900]);
    expect(steps[1]?.[1]).toBe("呼び出し中...");
    clock.advance(1);
    await expect(handle.done).resolves.toBe(true);
    expect(clock.pending).toBe(0);
  });

  it("ISDN は 1,900ms で接続済みになる", async () => {
    const { clock, steps, handle } = start("isdn");
    clock.runAll();
    expect(steps.map(([at]) => at)).toEqual([0, 600, 1300]);
    expect(clock.now()).toBe(1900);
    await expect(handle.done).resolves.toBe(true);
  });

  it("切断すると以降の文言を出さず false で終わる", async () => {
    const { clock, steps, handle } = start("modem");
    clock.advance(3000);
    handle.abort();
    clock.runAll();
    expect(steps).toHaveLength(2);
    expect(clock.pending).toBe(0);
    await expect(handle.done).resolves.toBe(false);
  });
});
