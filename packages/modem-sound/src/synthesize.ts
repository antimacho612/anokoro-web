import { createRandom, type Random } from "./random.ts";

export const SAMPLE_RATE = 22050;

type Waveform = (t: number) => number;

export interface ModemSegment {
  name: string;
  durationSec: number;
  createWaveform(random: Random, sampleRate: number): Waveform;
}

const sine = (freq: number, t: number) => Math.sin(2 * Math.PI * freq * t);

const silence = (durationSec: number): ModemSegment => ({
  name: "無音",
  durationSec,
  createWaveform: () => () => 0,
});

const tone = (name: string, durationSec: number, waveform: Waveform): ModemSegment => ({
  name,
  durationSec,
  createWaveform: () => waveform,
});

/** ITU-T Q.23 の DTMF 周波数（低群, 高群） */
const DTMF: Record<string, readonly [number, number]> = {
  "0": [941, 1336],
  "1": [697, 1209],
  "2": [697, 1336],
  "3": [697, 1477],
  "4": [770, 1209],
  "5": [770, 1336],
  "6": [770, 1477],
  "7": [852, 1209],
  "8": [852, 1336],
  "9": [852, 1477],
};

const DIAL_DIGITS = ["0", "5", "7", "0", "1", "2", "3", "4", "5", "6"] as const;

function dtmfSegments(): ModemSegment[] {
  return DIAL_DIGITS.flatMap((digit) => {
    const [low, high] = DTMF[digit]!;
    return [
      tone(`プッシュ音 ${digit}`, 0.08, (t) => 0.2 * (sine(low, t) + sine(high, t))),
      silence(0.06),
    ];
  });
}

function fsk(
  freq0: number,
  freq1: number,
  baud: number,
  random: Random,
  sampleRate: number,
): Waveform {
  let phase = 0;
  let bit = 0;
  let lastSymbol = -1;
  return (t) => {
    const symbol = Math.floor(t * baud);
    if (symbol !== lastSymbol) {
      lastSymbol = symbol;
      bit = random() < 0.5 ? 1 : 0;
    }
    phase += (2 * Math.PI * (bit ? freq1 : freq0)) / sampleRate;
    return Math.sin(phase);
  };
}

const negotiation: ModemSegment = {
  name: "ネゴシエーション",
  durationSec: 0.9,
  createWaveform: (random, sampleRate) => {
    const low = fsk(980, 1180, 300, random, sampleRate);
    const high = fsk(1650, 1850, 300, random, sampleRate);
    return (t) => 0.13 * low(t) + 0.13 * high(t);
  },
};

const probe: Waveform = (t) => {
  let sum = 0;
  for (let k = 1; k <= 24; k++) sum += Math.cos(2 * Math.PI * 150 * k * t + k * k * 0.3);
  return 0.045 * sum;
};

const TRAINING_SEC = 2.2;

const training: ModemSegment = {
  name: "トレーニング",
  durationSec: TRAINING_SEC,
  createWaveform: (random) => {
    let lowPassed = 0;
    let previous = 0;
    return (t) => {
      const white = random() * 2 - 1;
      lowPassed += 0.35 * (white - lowPassed);
      const bandPassed = lowPassed - previous;
      previous = lowPassed;
      const fadeOut = Math.min(1, (TRAINING_SEC - t) * 5);
      return 0.9 * bandPassed * (0.85 + 0.15 * sine(7, t)) * fadeOut;
    };
  },
};

export const MODEM_SEGMENTS: readonly ModemSegment[] = [
  tone("発信音", 0.7, (t) => 0.16 * (sine(350, t) + sine(440, t))),
  silence(0.15),
  ...dtmfSegments(),
  silence(0.2),
  tone("呼び出し音", 1.0, (t) => 0.22 * sine(400, t) * (0.5 + 0.5 * sine(16, t))),
  silence(0.13),
  tone(
    "応答音",
    1.3,
    (t) => 0.28 * sine(2100, t) * (0.8 + 0.2 * sine(15, t)) * (Math.floor(t / 0.45) % 2 ? -1 : 1),
  ),
  negotiation,
  silence(0.1),
  tone("回線プローブ", 0.3, probe),
  silence(0.12),
  tone("回線プローブ", 0.3, probe),
  silence(0.1),
  training,
];

export interface SynthesizeOptions {
  seed: number;
  sampleRate?: number;
}

/** 接続音の全体をモノラルの波形として計算する。同じシードなら同じ波形になる */
export function synthesizeModemSound({
  seed,
  sampleRate = SAMPLE_RATE,
}: SynthesizeOptions): Float32Array<ArrayBuffer> {
  const random = createRandom(seed);
  const lengths = MODEM_SEGMENTS.map((segment) => Math.floor(segment.durationSec * sampleRate));
  const samples = new Float32Array(lengths.reduce((sum, n) => sum + n, 0));
  let offset = 0;
  MODEM_SEGMENTS.forEach((segment, index) => {
    const waveform = segment.createWaveform(random, sampleRate);
    const length = lengths[index]!;
    for (let i = 0; i < length; i++) samples[offset + i] = waveform(i / sampleRate);
    offset += length;
  });
  return samples;
}
