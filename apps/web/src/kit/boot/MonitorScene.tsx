import { MAX_YEAR, MIN_YEAR, type Year } from "@anokoro/era-data";
import { useId, type CSSProperties, type ReactNode, type Ref } from "react";
import styles from "./BootScreen.module.css";
import { DeskIllustration, GLASS, POWER, SCENE_VIEWBOX } from "./DeskIllustration.tsx";

export interface StandbyControls {
  onPower: () => void;
  onSkip: () => void;
  onSoundChange: (soundOn: boolean) => void;
}

export type MonitorPower = { kind: "standby"; controls: StandbyControls } | { kind: "poweredOn" };

type MonitorSceneProps = {
  destination: Year;
  durationSec: number;
  soundOn: boolean;
  power: MonitorPower;
  sceneRef?: Ref<HTMLDivElement>;
  screenRef?: Ref<HTMLDivElement>;
  children?: ReactNode;
};

const pct = (value: number, total: number): string => `${((value / total) * 100).toFixed(3)}%`;

const NOTE_BOTTOM = 428;
const ARROW_END = POWER.cy - POWER.r - 8;

const SCREEN_STYLE: CSSProperties = {
  left: pct(GLASS.x, SCENE_VIEWBOX.width),
  top: pct(GLASS.y, SCENE_VIEWBOX.height),
  width: pct(GLASS.width, SCENE_VIEWBOX.width),
  height: pct(GLASS.height, SCENE_VIEWBOX.height),
  borderRadius: `${pct(GLASS.radius, GLASS.width)} / ${pct(GLASS.radius, GLASS.height)}`,
};

const POWER_STYLE: CSSProperties = {
  left: pct(POWER.cx, SCENE_VIEWBOX.width),
  top: pct(POWER.cy, SCENE_VIEWBOX.height),
  width: pct(POWER.r * 2, SCENE_VIEWBOX.width),
};

const NOTE_STYLE: CSSProperties = {
  left: pct(POWER.cx, SCENE_VIEWBOX.width),
  bottom: pct(SCENE_VIEWBOX.height - NOTE_BOTTOM, SCENE_VIEWBOX.height),
};

const ARROW_STYLE: CSSProperties = {
  left: pct(POWER.cx, SCENE_VIEWBOX.width),
  top: pct(NOTE_BOTTOM + 2, SCENE_VIEWBOX.height),
  height: pct(ARROW_END - NOTE_BOTTOM - 2, SCENE_VIEWBOX.height),
};

function PowerSymbol() {
  return (
    <svg viewBox="0 0 24 24" className={styles.powerSymbol} aria-hidden="true">
      <path
        d="M12 3.5v8M6.6 6.6a7.6 7.6 0 1 0 10.8 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MonitorScene({
  destination,
  durationSec,
  soundOn,
  power,
  sceneRef,
  screenRef,
  children,
}: MonitorSceneProps) {
  const soundNoteId = useId();
  const isPoweredOn = power.kind === "poweredOn";
  const controls = power.kind === "standby" ? power.controls : undefined;
  const rootClass = `${styles.room} ${isPoweredOn ? styles.poweredOn : ""}`;
  return (
    <div ref={sceneRef} className={rootClass} inert={isPoweredOn}>
      <header className={styles.intro}>
        <h1 className={styles.siteTitle}>あのころ Web</h1>
        <p className={styles.lead}>
          {MIN_YEAR}〜{MAX_YEAR} 年の日本の Web を、ページ作りと回線ごと追体験できる作成キット
        </p>
      </header>

      <div className={styles.scene}>
        <div className={styles.core}>
          <DeskIllustration isPoweredOn={isPoweredOn} />
          <div ref={screenRef} className={styles.screen} style={SCREEN_STYLE}>
            {children}
            <div className={styles.glass} aria-hidden="true" />
          </div>
          <button
            type="button"
            className={styles.powerButton}
            style={POWER_STYLE}
            onClick={controls?.onPower}
            aria-label="電源を入れる"
            autoFocus
          >
            <PowerSymbol />
          </button>
          <div className={styles.sticky} style={NOTE_STYLE} aria-hidden="true">
            <span className={styles.stickySmall}>行き先</span>
            <span className={styles.stickyYear}>{destination} 年</span>
            <span className={styles.stickySmall}>ここを押して起動</span>
          </div>
          <svg
            className={styles.stickyArrow}
            style={ARROW_STYLE}
            viewBox="0 0 20 48"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M7 1C11 14 12 28 10 45M4 36l6 9 6-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      <div className={styles.guide}>
        <p className={styles.guideMain}>
          電源を入れると {destination} 年のパソコンが起動します（約 {durationSec} 秒）
        </p>
        <div className={styles.guideControls}>
          <label className={styles.soundToggle}>
            <input
              type="checkbox"
              role="switch"
              aria-label="効果音"
              aria-describedby={soundNoteId}
              checked={soundOn}
              onChange={(e) => controls?.onSoundChange(e.currentTarget.checked)}
            />
            <span className={styles.track} aria-hidden="true">
              <span className={styles.knob} />
            </span>
            <span aria-hidden="true">効果音 {soundOn ? "ON" : "OFF"}</span>
            <span id={soundNoteId} className={styles.soundNote}>
              （回線の接続音にも反映）
            </span>
          </label>
          <button type="button" className={styles.skipLink} onClick={controls?.onSkip}>
            スキップしてキットを開く（Esc）
          </button>
        </div>
      </div>
    </div>
  );
}
