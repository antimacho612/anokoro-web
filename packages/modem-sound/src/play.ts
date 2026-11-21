export const MODEM_VOLUME = 0.5;

/** Web Audio API のうち再生に使う部分。DOM の型に依存しないよう構造で受け取る */
export interface AudioContextLike {
  readonly destination: unknown;
  readonly state: string;
  resume(): Promise<void>;
  createBuffer(channels: number, length: number, sampleRate: number): AudioBufferLike;
  createGain(): GainNodeLike;
  createBufferSource(): BufferSourceLike;
}

export interface AudioBufferLike {
  copyToChannel(source: Float32Array<ArrayBuffer>, channel: number): void;
}

export interface GainNodeLike {
  readonly gain: { value: number };
  connect(destination: unknown): unknown;
}

export interface BufferSourceLike {
  buffer: AudioBufferLike | null;
  connect(destination: unknown): unknown;
  start(): void;
  stop(): void;
}

export interface ModemPlayback {
  stop(): void;
}

/** ユーザーの操作の処理中に呼ぶ。自動再生の制限で止まっている context は再開する */
export function playModemSound(
  context: AudioContextLike,
  samples: Float32Array<ArrayBuffer>,
  sampleRate: number,
): ModemPlayback {
  if (context.state === "suspended") void context.resume();
  const buffer = context.createBuffer(1, samples.length, sampleRate);
  buffer.copyToChannel(samples, 0);
  const gain = context.createGain();
  gain.gain.value = MODEM_VOLUME;
  gain.connect(context.destination);
  const source = context.createBufferSource();
  source.buffer = buffer;
  source.connect(gain);
  source.start();
  let stopped = false;
  return {
    stop() {
      if (stopped) return;
      stopped = true;
      source.stop();
    },
  };
}
