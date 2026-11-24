import { createRandom, type Random } from "@anokoro/shared";
import {
  phaseStartMs,
  totalMs,
  warpAccents,
  warpSpeed,
  yearChangeTimes,
  type BootTimeline,
  type WarpAccentKind,
} from "./boot-timeline.ts";
import { GO_AT_MS } from "./post-script.ts";

export const BOOT_SAMPLE_RATE = 22050;

export interface BootSoundOptions {
  timeline: BootTimeline;
  seed: number;
  sampleRate?: number;
}

const TAU = Math.PI * 2;

class Track {
  readonly samples: Float32Array<ArrayBuffer>;
  readonly sampleRate: number;

  constructor(sampleRate: number, durationMs: number) {
    this.sampleRate = sampleRate;
    this.samples = new Float32Array(Math.ceil((durationMs / 1000) * sampleRate));
  }

  /** atMs から durationMs の間、wave(経過秒) を足す */
  add(atMs: number, durationMs: number, wave: (t: number) => number): void {
    const from = Math.max(0, Math.floor((atMs / 1000) * this.sampleRate));
    const to = Math.min(
      this.samples.length,
      Math.ceil(((atMs + durationMs) / 1000) * this.sampleRate),
    );
    for (let i = from; i < to; i++) {
      this.samples[i]! += wave(i / this.sampleRate - atMs / 1000);
    }
  }
}

const decay = (t: number, seconds: number): number => Math.exp(-t / seconds);

function click(track: Track, random: Random, atMs: number, gain: number, ringHz = 1800): void {
  track.add(atMs, 30, (t) => {
    const noise = t < 0.004 ? (random() * 2 - 1) * decay(t, 0.0015) : 0;
    return gain * (noise + 0.5 * Math.sin(TAU * ringHz * t) * decay(t, 0.006));
  });
}

function thump(track: Track, atMs: number, hz: number, durationMs: number, gain: number): void {
  let phase = 0;
  const dt = 1 / track.sampleRate;
  track.add(atMs, durationMs, (t) => {
    phase += TAU * hz * (1 - 0.4 * Math.min(1, t / (durationMs / 1000))) * dt;
    return gain * Math.sin(phase) * decay(t, durationMs / 4000);
  });
}

function crtPowerOn(track: Track, random: Random, atMs: number, untilMs: number): void {
  track.add(atMs, 140, (t) => (random() < 0.08 ? (random() * 2 - 1) * 0.5 : 0) * decay(t, 0.05));
  track.add(atMs, untilMs - atMs, (t) => {
    const swell = Math.min(1, t / 0.05) * (0.12 + 0.88 * decay(t, 0.25));
    const hum =
      Math.sin(TAU * 50 * t) + 0.5 * Math.sin(TAU * 100 * t) + 0.25 * Math.sin(TAU * 150 * t);
    return 0.09 * swell * hum;
  });
}

function postBeep(track: Track, atMs: number): void {
  const hz = 1000;
  const seconds = 0.12;
  track.add(atMs, seconds * 1000, (t) => {
    const envelope = Math.min(1, t / 0.005, (seconds - t) / 0.005);
    return 0.16 * envelope * (Math.sin(TAU * hz * t) + 0.3 * Math.sin(TAU * 3 * hz * t));
  });
}

function diskSeeks(track: Track, random: Random, fromMs: number, toMs: number): void {
  const count = 6 + Math.floor(random() * 4);
  for (let i = 0; i < count; i++) {
    click(track, random, fromMs + random() * (toMs - fromMs), 0.12 + random() * 0.1, 2200);
  }
}

/** 係数は Audio EQ Cookbook の BPF（出典: https://www.w3.org/TR/audio-eq-cookbook/） */
function bandpassNoise(
  track: Track,
  random: Random,
  atMs: number,
  durationMs: number,
  centerHz: (ms: number) => number,
  gain: (ms: number) => number,
): void {
  const q = 1.4;
  let x1 = 0;
  let x2 = 0;
  let y1 = 0;
  let y2 = 0;
  track.add(atMs, durationMs, (t) => {
    const ms = atMs + t * 1000;
    const w0 = (TAU * centerHz(ms)) / track.sampleRate;
    const alpha = Math.sin(w0) / (2 * q);
    const a0 = 1 + alpha;
    const x0 = random() * 2 - 1;
    const y0 = (alpha * x0 - alpha * x2 + 2 * Math.cos(w0) * y1 - (1 - alpha) * y2) / a0;
    x2 = x1;
    x1 = x0;
    y2 = y1;
    y1 = y0;
    return gain(ms) * y0;
  });
}

function warpDrone(
  track: Track,
  atMs: number,
  durationMs: number,
  speed: (ms: number) => number,
): void {
  let phase = 0;
  const dt = 1 / track.sampleRate;
  track.add(atMs, durationMs, (t) => {
    const s = speed(atMs + t * 1000);
    phase += TAU * (48 + 40 * s) * dt;
    const tone = Math.sin(phase) + 0.5 * Math.sin(2 * phase) + 0.3 * Math.sin(3 * phase);
    return 0.12 * s * tone;
  });
}

function degauss(track: Track, atMs: number): void {
  let phase = 0;
  const dt = 1 / track.sampleRate;
  track.add(atMs, 700, (t) => {
    phase += TAU * (58 + 5 * Math.sin(TAU * 7 * t)) * dt;
    const envelope = Math.min(1, t / 0.02) * decay(t, 0.18);
    return 0.32 * envelope * (Math.sin(phase) + 0.4 * Math.sin(2 * phase));
  });
}

function chargeUp(track: Track, atMs: number, durationMs: number): void {
  let phase = 0;
  const dt = 1 / track.sampleRate;
  const seconds = durationMs / 1000;
  track.add(atMs, durationMs, (t) => {
    const u = t / seconds;
    phase += TAU * (180 + 1200 * u * u) * dt;
    const wobble = 0.75 + 0.25 * Math.sin(TAU * (6 + 24 * u) * t);
    const envelope = u * Math.min(1, (seconds - t) / 0.02);
    return 0.08 * envelope * wobble * (Math.sin(phase) + 0.3 * Math.sin(2 * phase));
  });
}

function boom(track: Track, random: Random, atMs: number, gain: number): void {
  thump(track, atMs, 62, 560, gain);
  bandpassNoise(
    track,
    random,
    atMs,
    420,
    () => 220,
    (ms) => gain * decay((ms - atMs) / 1000, 0.08),
  );
}

const ACCENT_SOUNDS: Record<WarpAccentKind, (track: Track, random: Random, atMs: number) => void> =
  {
    enterSupportedRange: (track, random, atMs) => {
      click(track, random, atMs, 0.26, 600);
      thump(track, atMs, 90, 140, 0.24);
    },
    themeCheckpoint: (track, random, atMs) => {
      click(track, random, atMs, 0.22, 600);
      thump(track, atMs, 110, 80, 0.18);
    },
    finalStep: (track, random, atMs) => {
      click(track, random, atMs, 0.2, 1400);
      thump(track, atMs, 140, 70, 0.12);
    },
  };

function lock(track: Track, random: Random, atMs: number): void {
  thump(track, atMs, 90, 220, 0.5);
  click(track, random, atMs, 0.55, 700);
  click(track, random, atMs + 60, 0.35, 1100);
  degauss(track, atMs + 40);
}

function smoothed(target: (ms: number) => number, tauMs: number): (ms: number) => number {
  let value = 0;
  let last: number | undefined;
  return (ms) => {
    const dt = last === undefined ? 0 : ms - last;
    if (dt < 0) throw new RangeError(`smoothed は時刻の順に呼ぶ（${last} の後に ${ms}）`);
    last = ms;
    value += (target(ms) - value) * (1 - Math.exp(-dt / tauMs));
    return value;
  };
}

function softClip(samples: Float32Array<ArrayBuffer>): void {
  for (let i = 0; i < samples.length; i++) samples[i] = Math.tanh(samples[i]! * 1.1) * 0.9;
}

export function synthesizeBootSound({
  timeline,
  seed,
  sampleRate = BOOT_SAMPLE_RATE,
}: BootSoundOptions): Float32Array<ArrayBuffer> {
  const random = createRandom(seed);
  const end = totalMs(timeline);
  const track = new Track(sampleRate, end);
  const post = phaseStartMs(timeline, "selfTest");
  const launch = phaseStartMs(timeline, "diveIn");
  const warp = phaseStartMs(timeline, "warp");
  const arrive = phaseStartMs(timeline, "arrive");

  click(track, random, 0, 0.5, 900);
  thump(track, 0, 120, 60, 0.3);

  if (!timeline.warp || post === undefined || launch === undefined || warp === undefined) {
    if (arrive !== undefined) {
      postBeep(track, arrive + 150);
    }
    softClip(track.samples);
    return track.samples;
  }

  crtPowerOn(track, random, 110, warp);
  postBeep(track, post + 90);
  diskSeeks(track, random, post + 220, post + 1000);
  chargeUp(track, post + GO_AT_MS, warp - (post + GO_AT_MS));
  bandpassNoise(
    track,
    random,
    launch,
    warp - launch,
    (ms) => 300 + 2700 * ((ms - launch) / (warp - launch)) ** 2,
    (ms) => 0.04 + 0.36 * ((ms - launch) / (warp - launch)) ** 2,
  );
  boom(track, random, warp, 0.45);

  const length = (arrive ?? end) - warp + 250;
  const noiseSpeed = smoothed((ms) => warpSpeed(timeline, ms), 60);
  const droneSpeed = smoothed((ms) => warpSpeed(timeline, ms), 60);
  bandpassNoise(
    track,
    random,
    warp,
    length,
    (ms) => 260 + 2400 * noiseSpeed(ms),
    (ms) => 0.04 + 0.42 * noiseSpeed(ms),
  );
  warpDrone(track, warp, length, droneSpeed);
  for (const { atMs } of yearChangeTimes(timeline)) click(track, random, atMs, 0.09, 2600);
  for (const accent of warpAccents(timeline))
    ACCENT_SOUNDS[accent.kind](track, random, accent.atMsFromBoot);

  if (arrive !== undefined) lock(track, random, arrive);

  softClip(track.samples);
  return track.samples;
}
