import { describe, expect, test, vi } from "vite-plus/test";
import { MODEM_VOLUME, playModemSound, type AudioContextLike } from "./play.ts";

function fakeContext(state: string) {
  const buffer = { copyToChannel: vi.fn() };
  const gain = { gain: { value: 1 }, connect: vi.fn() };
  const source = { buffer: null, connect: vi.fn(), start: vi.fn(), stop: vi.fn() };
  const context = {
    destination: {},
    state,
    resume: vi.fn(async () => {}),
    createBuffer: vi.fn(() => buffer),
    createGain: () => gain,
    createBufferSource: () => source,
  } satisfies AudioContextLike;
  return { context, buffer, gain, source };
}

describe("playModemSound", () => {
  const samples = new Float32Array([0, 0.5, -0.5]);

  test("音量 0.5 で波形を再生する", () => {
    const { context, buffer, gain, source } = fakeContext("running");
    playModemSound(context, samples, 22050);
    expect(context.createBuffer).toHaveBeenCalledWith(1, 3, 22050);
    expect(buffer.copyToChannel).toHaveBeenCalledWith(samples, 0);
    expect(gain.gain.value).toBe(MODEM_VOLUME);
    expect(gain.connect).toHaveBeenCalledWith(context.destination);
    expect(source.buffer).toBe(buffer);
    expect(source.connect).toHaveBeenCalledWith(gain);
    expect(source.start).toHaveBeenCalledOnce();
    expect(context.resume).not.toHaveBeenCalled();
  });

  test("止まっている context は再開する", () => {
    const { context } = fakeContext("suspended");
    playModemSound(context, samples, 22050);
    expect(context.resume).toHaveBeenCalledOnce();
  });

  test("stop を何度呼んでも止めるのは 1 回", () => {
    const { context, source } = fakeContext("running");
    const playback = playModemSound(context, samples, 22050);
    playback.stop();
    playback.stop();
    expect(source.stop).toHaveBeenCalledOnce();
  });
});
