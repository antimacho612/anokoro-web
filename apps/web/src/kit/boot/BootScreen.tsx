import { playModemSound, type ModemPlayback } from "@anokoro/modem-sound";
import { useEffect, useEffectEvent, useRef, useState, type RefObject } from "react";
import { kitStore, useKit } from "../store.ts";
import { browserSession, markBooted } from "./boot-session.ts";
import { BOOT_SAMPLE_RATE, synthesizeBootSound } from "./boot-sound.ts";
import { bootStore } from "./boot-store.ts";
import {
  calmTimeline,
  durationSeconds,
  fullTimeline,
  journeyFor,
  type BootTimeline,
} from "./boot-timeline.ts";
import styles from "./BootScreen.module.css";
import { BootSequence, type BootRun } from "./BootSequence.tsx";
import { MonitorScene } from "./MonitorScene.tsx";

type BootScreenProps = {
  kitRoot: RefObject<HTMLElement | null>;
};

interface BootAudio {
  context: AudioContext;
  playback: ModemPlayback;
}

/**
 * ユーザー操作の外での Web Audio の再生は、ブラウザの自動再生の制限を受ける。
 * 電源ボタンのクリックの処理中に作って鳴らす
 * （出典: https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay）
 */
function playBootSound({ timeline, seed }: BootRun): BootAudio | null {
  try {
    const context = new AudioContext();
    const samples = synthesizeBootSound({ timeline, seed });
    return { context, playback: playModemSound(context, samples, BOOT_SAMPLE_RATE) };
  } catch {
    return null;
  }
}

function stopBootSound(audio: BootAudio | null): void {
  if (!audio) return;
  try {
    audio.playback.stop();
  } catch {}
  audio.context.close().catch(() => {});
}

function prefersCalm(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function planTimeline(year: number, isCalm: boolean): BootTimeline {
  const journey = journeyFor(year, new Date().getFullYear());
  return isCalm ? calmTimeline(journey) : fullTimeline(journey);
}

export function BootScreen({ kitRoot }: BootScreenProps) {
  const year = useKit((s) => s.year);
  const [isCalm] = useState(prefersCalm);
  const [run, setRun] = useState<BootRun | null>(null);
  const [soundOn, setSoundOn] = useState(() => kitStore.getState().sound);
  const [returnFocus] = useState(() => bootStore.getState().returnFocus);
  const audioRef = useRef<BootAudio | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const handleClose = (): void => {
    stopBootSound(audioRef.current);
    audioRef.current = null;
    markBooted(browserSession);
    bootStore.getState().close();
  };

  const handleSkipBeforePower = (): void => {
    kitStore.getState().setSound(soundOn);
    handleClose();
  };

  const handlePower = (): void => {
    kitStore.getState().setSound(soundOn);
    const next: BootRun = {
      timeline: planTimeline(year, isCalm),
      seed: Date.now() >>> 0,
      soundOn,
      isCalm,
    };
    if (soundOn) audioRef.current = playBootSound(next);
    setRun(next);
    bootStore.getState().start();
    rootRef.current?.focus();
  };

  const handleEscape = useEffectEvent((): void => {
    if (run) handleClose();
    else handleSkipBeforePower();
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      handleEscape();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => () => stopBootSound(audioRef.current), []);

  useEffect(
    () => () => {
      if (returnFocus?.isConnected) returnFocus.focus();
    },
    [returnFocus],
  );

  return (
    <div
      ref={rootRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="あのころ Web の起動"
      tabIndex={-1}
      data-boot-screen=""
    >
      {run ? (
        <BootSequence run={run} kitRoot={kitRoot} onDone={handleClose} onSkip={handleClose} />
      ) : (
        <MonitorScene
          destination={year}
          durationSec={durationSeconds(planTimeline(year, isCalm))}
          soundOn={soundOn}
          controls={{
            onPower: handlePower,
            onSkip: handleSkipBeforePower,
            onSoundChange: setSoundOn,
          }}
        />
      )}
    </div>
  );
}
