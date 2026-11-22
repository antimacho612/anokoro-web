import {
  SAMPLE_RATE,
  playModemSound,
  synthesizeModemSound,
  type AudioContextLike,
  type ModemPlayback,
} from "@anokoro/modem-sound";

export interface ModemSound {
  /** クリックの処理中に呼ぶ */
  play(): void;
  stop(): void;
}

const MODEM_SEED = 1995;

/** 波形は最初の再生で一度だけ計算する */
export function createModemPlayer(createContext: () => AudioContextLike): ModemSound {
  let context: AudioContextLike | null = null;
  let samples: Float32Array<ArrayBuffer> | null = null;
  let playback: ModemPlayback | null = null;

  const stop = (): void => {
    try {
      playback?.stop();
    } catch {
      // 再生が終わったあとの stop は環境によって例外になるが、止める目的は果たしている
    }
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
        // Web Audio API が使えない環境では無音で接続を続ける
        playback = null;
      }
    },
    stop,
  };
}
