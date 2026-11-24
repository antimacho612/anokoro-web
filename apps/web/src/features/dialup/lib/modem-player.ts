import {
  SAMPLE_RATE,
  playModemSound,
  synthesizeModemSound,
  type AudioContextLike,
  type ModemPlayback,
} from "@anokoro/modem-sound";

export interface ModemSound {
  /**
   * クリックの処理中に呼ぶ。ユーザー操作の外での Web Audio の再生は、ブラウザの自動再生の制限を受ける
   * （出典: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay）
   */
  play(): void;
  stop(): void;
}

const MODEM_SEED = 1995;

export function createModemPlayer(createContext: () => AudioContextLike): ModemSound {
  let context: AudioContextLike | null = null;
  let samples: Float32Array<ArrayBuffer> | null = null;
  let playback: ModemPlayback | null = null;

  const stop = (): void => {
    try {
      playback?.stop();
    } catch {}
    playback = null;
  };

  return {
    play() {
      stop();
      try {
        context ??= createContext();
        samples ??= synthesizeModemSound({ seed: MODEM_SEED });
        playback = playModemSound(context, samples, SAMPLE_RATE);
      } catch {
        playback = null;
      }
    },
    stop,
  };
}
