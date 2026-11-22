import { ASSETS, toDataUri } from "@anokoro/assets";
import { isYear, type Year } from "@anokoro/era-data";
import { useEffect, useEffectEvent, useRef, useState, type RefObject } from "react";
import { planFragments, type FragmentAsset } from "./boot-fragments.ts";
import {
  PHASE_MS,
  digitPosition,
  displayYear,
  durationSeconds,
  phaseAt,
  phaseStartMs,
  warpSpeed,
  yearAt,
  type BootPhaseId,
  type BootTimeline,
} from "./boot-timeline.ts";
import styles from "./BootScreen.module.css";
import { environmentItems } from "./era-info.ts";
import { eraPalette } from "./era-palette.ts";
import { MonitorScene } from "./MonitorScene.tsx";
import { memoryText, postLines, type PostLine } from "./post-script.ts";
import { startReveal, type RevealRun } from "./reveal.ts";
import { WarpRenderer } from "./warp-renderer.ts";

export interface BootRun {
  timeline: BootTimeline;
  seed: number;
  soundOn: boolean;
  isCalm: boolean;
}

type BootSequenceProps = {
  run: BootRun;
  kitRoot: RefObject<HTMLElement | null>;
  onDone: () => void;
  onSkip: () => void;
};

const DIGIT_PLACES = [3, 2, 1, 0] as const;
const DRUM_DIGITS = "01234567890".split("");
const FRAGMENT_ASSETS: readonly FragmentAsset[] = ["koji.gif", "new.gif"];

function loadFragmentImages(): Map<FragmentAsset, HTMLImageElement> {
  const images = new Map<FragmentAsset, HTMLImageElement>();
  for (const name of FRAGMENT_ASSETS) {
    const asset = ASSETS.find((a) => a.name === name);
    if (!asset) continue;
    const image = new Image();
    image.src = toDataUri(asset.svg);
    images.set(name, image);
  }
  return images;
}

function createRenderer(canvas: HTMLCanvasElement | null, run: BootRun): WarpRenderer | null {
  if (run.isCalm || !canvas) return null;
  try {
    const fragments = planFragments(run.timeline, run.seed);
    return new WarpRenderer(canvas, fragments, loadFragmentImages(), run.seed);
  } catch {
    return null;
  }
}

/** 回転式カウンターの桁を年に合わせて回し、速く回る桁ほどぼかす */
function createOdometer(strips: readonly (HTMLSpanElement | null)[]) {
  const last = DIGIT_PLACES.map(() => Number.NaN);
  const blur = DIGIT_PLACES.map(() => 0);
  return (year: number, dtMs: number): void => {
    DIGIT_PLACES.forEach((place, i) => {
      const strip = strips[i];
      if (!strip) return;
      const position = digitPosition(year, place);
      const moved = Number.isNaN(last[i]!) ? 0 : Math.abs(position - last[i]!);
      const speed = Math.min(moved, 10 - moved) / Math.max(1, dtMs);
      blur[i] = blur[i]! * 0.6 + Math.min(7, speed * 220) * 0.4;
      last[i] = position;
      strip.style.setProperty("--pos", position.toFixed(4));
      strip.style.setProperty("--blur", `${blur[i]!.toFixed(2)}px`);
    });
  };
}

/** ブラウン管の中へ飛び込むように、画面がビューポートいっぱいになるまで寄る */
function startLaunch(scene: HTMLElement | null, screen: HTMLElement | null): Animation | null {
  if (!scene || !screen || typeof scene.animate !== "function") return null;
  const box = scene.getBoundingClientRect();
  const rect = screen.getBoundingClientRect();
  const scale = Math.max(box.width / rect.width, box.height / rect.height) * 1.2;
  const cx = rect.x + rect.width / 2 - box.x;
  const cy = rect.y + rect.height / 2 - box.y;
  scene.style.transformOrigin = `${cx}px ${cy}px`;
  return scene.animate(
    [
      { transform: "none", filter: "none" },
      {
        transform: `translate(${box.width / 2 - cx}px, ${box.height / 2 - cy}px) scale(${scale})`,
        filter: "brightness(2.2) blur(3px)",
      },
    ],
    { duration: PHASE_MS.launch, easing: "cubic-bezier(0.6, 0, 0.9, 0.3)", fill: "forwards" },
  );
}

function liveMessage(phase: BootPhaseId, to: Year): string {
  switch (phase) {
    case "power":
    case "post":
    case "launch":
      return "起動しています";
    case "warp":
      return `${to}年へ移動しています`;
    default:
      return `${to}年に到着しました`;
  }
}

function PostScreen({
  lines,
  memoryRef,
}: {
  lines: readonly PostLine[];
  memoryRef: RefObject<HTMLSpanElement | null>;
}) {
  return (
    <div className={styles.post} aria-hidden="true">
      <svg className={styles.emblem} viewBox="0 0 16 20" shapeRendering="crispEdges">
        <rect x="1" y="0" width="14" height="2" fill="#c98a2b" />
        <rect x="1" y="18" width="14" height="2" fill="#c98a2b" />
        <path d="M3 2h10v3l-3 4v2l3 4v3H3v-3l3-4V9L3 5z" fill="none" stroke="#ffd27a" />
        <path d="M5 4h6v1L8 8.5 5 5z" fill="#ffb84d" />
        <path d="M5 17h6v-1.5L8 13l-3 2.5z" fill="#ffb84d" />
        <rect x="7.5" y="8" width="1" height="6" fill="#ffb84d" />
      </svg>
      {lines.map((line) => (
        <p
          key={line.key}
          className={`${styles.postLine} ${line.tone ? styles[line.tone] : ""}`}
          style={{ animationDelay: `${line.atMs}ms` }}
        >
          {line.label}
          {line.value !== undefined && (
            <span
              ref={line.live === "memory" ? memoryRef : undefined}
              className={styles.value}
              style={{ animationDelay: `${line.atMs}ms` }}
            >
              {line.value}
            </span>
          )}
          {line.result && (
            <b className={styles.result} style={{ animationDelay: `${line.result.atMs}ms` }}>
              {line.result.text}
            </b>
          )}
          {line.tone === "go" && <span className={styles.cursor}>_</span>}
        </p>
      ))}
    </div>
  );
}

function EnvironmentReadout({ year }: { year: Year | null }) {
  const text = year
    ? environmentItems(year)
        .map((item) => `${item.label} ${item.value}`)
        .join("　")
    : "";
  return <p className={styles.readout}>{text}</p>;
}

export function BootSequence({ run, kitRoot, onDone, onSkip }: BootSequenceProps) {
  const { timeline, isCalm } = run;
  const { to } = timeline.journey;
  const [phase, setPhase] = useState<BootPhaseId>(timeline.phases[0]!.id);
  const [eraYear, setEraYear] = useState<Year | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);
  const stripRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const memoryRef = useRef<HTMLSpanElement>(null);
  const finish = useEffectEvent(onDone);

  useEffect(() => {
    const renderer = createRenderer(canvasRef.current, run);
    const updateOdometer = createOdometer(stripRefs.current);
    const handleResize = (): void => renderer?.resize();
    window.addEventListener("resize", handleResize);

    const postStart = phaseStartMs(timeline, "post");
    let current: BootPhaseId | "done" = timeline.phases[0]!.id;
    let shownYear: Year | null = null;
    let reveal: RevealRun | null = null;
    let launch: Animation | null = null;
    const start = performance.now();
    let last = start;
    let frame = 0;

    const tick = (now: number): void => {
      const elapsed = now - start;
      const dtMs = Math.min(100, now - last);
      last = now;
      const at = phaseAt(timeline, elapsed);
      if (at.id !== current) {
        current = at.id;
        if (at.id === "done") {
          finish();
          return;
        }
        setPhase(at.id);
        if (at.id === "launch") launch = startLaunch(sceneRef.current, screenRef.current);
        if (at.id === "reveal" && !isCalm && kitRoot.current) reveal = startReveal(kitRoot.current);
      }
      if (at.id === "done") return;

      const year = yearAt(timeline, elapsed);
      updateOdometer(year, dtMs);
      const shown = displayYear(year);
      const inEra = isYear(shown) ? shown : null;
      if (inEra !== shownYear) {
        shownYear = inEra;
        setEraYear(inEra);
      }
      rootRef.current?.style.setProperty("--era-glow", eraPalette(year).glow.join(" "));
      if (at.id === "post" && postStart !== undefined && memoryRef.current) {
        memoryRef.current.textContent = memoryText(elapsed - postStart);
      }
      if (renderer && (at.id === "warp" || at.id === "arrive")) {
        renderer.drawWarp({
          elapsedMs: elapsed,
          dtMs,
          speed: warpSpeed(timeline, elapsed),
          year,
          arrival: at.id === "arrive" ? at.progress : 0,
        });
      } else if (renderer && reveal) {
        renderer.drawOutlines(reveal.outlinesAt(at.elapsedInPhase));
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", handleResize);
      launch?.cancel();
      reveal?.cancel();
    };
  }, [run, timeline, isCalm, kitRoot]);

  const showsMonitor = phase === "power" || phase === "post" || phase === "launch";
  const hasArrived = phase === "arrive" || phase === "reveal";
  const showsCounter = phase === "warp" || hasArrived;
  const rootClass = [
    styles.sequence,
    isCalm && styles.calm,
    phase === "arrive" && !isCalm && styles.degauss,
    phase === "reveal" && styles.revealing,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={rootRef} className={rootClass} data-phase={phase}>
      <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />

      {showsMonitor && (
        <MonitorScene
          destination={to}
          durationSec={durationSeconds(timeline)}
          soundOn={run.soundOn}
          controls={null}
          sceneRef={sceneRef}
          screenRef={screenRef}
        >
          {phase === "power" ? (
            <div className={styles.crtOn} aria-hidden="true" />
          ) : (
            <PostScreen lines={postLines(timeline.journey)} memoryRef={memoryRef} />
          )}
        </MonitorScene>
      )}

      <div className={`${styles.stage} ${showsCounter ? styles.stageOn : ""}`} aria-hidden="true">
        <div className={`${styles.odometer} ${hasArrived ? styles.landed : ""}`}>
          {DIGIT_PLACES.map((place, i) => (
            <span key={place} className={styles.drum}>
              <span
                ref={(el) => {
                  stripRefs.current[i] = el;
                }}
                className={styles.strip}
              >
                {DRUM_DIGITS.map((digit, j) => (
                  <span key={j}>{digit}</span>
                ))}
              </span>
            </span>
          ))}
        </div>
        <div className={styles.stageInfo}>
          {hasArrived ? (
            <p className={styles.arrivalTitle}>{to} 年に到着</p>
          ) : (
            <p className={styles.destination}>行き先 {to} 年</p>
          )}
          <EnvironmentReadout year={hasArrived ? to : eraYear} />
        </div>
      </div>

      {phase === "warp" && <div className={styles.launchFlash} aria-hidden="true" />}

      <div className={styles.scanlines} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <p className={styles.srOnly} aria-live="polite">
        {liveMessage(phase, to)}
      </p>

      {phase !== "reveal" && (
        <button type="button" className={styles.skip} onClick={onSkip}>
          スキップ（Esc）
        </button>
      )}
    </div>
  );
}
