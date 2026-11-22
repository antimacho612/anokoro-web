import type { AudioContextLike } from "@anokoro/modem-sound";
import { describe, expect, it } from "vite-plus/test";
import { createModemPlayer } from "./modem-player.ts";

function fakeContext({ stopThrows = false } = {}) {
  const log = { started: 0, stopped: 0 };
  const context: AudioContextLike = {
    destination: {},
    state: "running",
    resume: () => Promise.resolve(),
    createBuffer: () => ({ copyToChannel: () => {} }),
    createGain: () => ({ gain: { value: 1 }, connect: () => undefined }),
    createBufferSource: () => ({
      buffer: null,
      connect: () => undefined,
      start: () => void log.started++,
      stop: () => {
        log.stopped++;
        if (stopThrows) throw new Error("InvalidStateError");
      },
    }),
  };
  return { context, log };
}

describe("createModemPlayer", () => {
  it("再生中に stop すると止める", () => {
    const { context, log } = fakeContext();
    const player = createModemPlayer(() => context);
    player.play();
    player.stop();
    expect(log).toEqual({ started: 1, stopped: 1 });
  });

  it("stop が例外を投げても、止めた扱いにして次の再生を始められる", () => {
    const { context, log } = fakeContext({ stopThrows: true });
    const player = createModemPlayer(() => context);
    player.play();
    expect(() => player.stop()).not.toThrow();
    expect(() => player.stop()).not.toThrow();
    player.play();
    expect(log).toEqual({ started: 2, stopped: 1 });
  });

  it("Web Audio API が使えなくても play は例外を投げない", () => {
    const player = createModemPlayer(() => {
      throw new Error("AudioContext is not defined");
    });
    expect(() => player.play()).not.toThrow();
    expect(() => player.stop()).not.toThrow();
  });
});
