import { MAX_YEAR, uiThemeForYear, type Year } from "@anokoro/era-data";

/** power: 電源が入る / post: BIOS 風の自己診断 / launch: 画面の中へ突入 / warp: 時空の跳躍 / arrive: 到着 / reveal: デスクトップが現れる */
export type BootPhaseId = "power" | "post" | "launch" | "warp" | "arrive" | "reveal";

export interface BootPhase {
  id: BootPhaseId;
  ms: number;
}

/** 跳躍の出発点と行き先 */
export interface Journey {
  from: number;
  to: Year;
}

/** 年カウンターの動きの 1 区間。時刻は跳躍の場面の始まりから。fromYear と toYear が同じなら止まっている */
export interface WarpSegment {
  startMs: number;
  endMs: number;
  fromYear: number;
  toYear: number;
  ease: "in" | "out" | "inOut";
  /** トンネルの流れの速さの目安 */
  speed: number;
}

/** entry: 対象の最終年に入る / checkpoint: 外観が変わる年で止まる / tick: 到着前の 1 年送り */
export type WarpAccentKind = "entry" | "checkpoint" | "tick";

export interface WarpAccent {
  atMs: number;
  kind: WarpAccentKind;
  year: number;
}

export interface WarpPlan {
  ms: number;
  segments: readonly WarpSegment[];
  accents: readonly WarpAccent[];
}

export interface BootTimeline {
  journey: Journey;
  phases: readonly BootPhase[];
  warp: WarpPlan | null;
}

export interface PhaseAt {
  id: BootPhaseId | "done";
  /** その場面の中での進み具合（0〜1） */
  progress: number;
  elapsedInPhase: number;
}

export const PHASE_MS = {
  power: 500,
  post: 1700,
  launch: 500,
  arrive: 1400,
  reveal: 900,
  calmArrive: 1600,
  calmReveal: 500,
} as const;

const LEAVE_MS = 450;
const HOLD_MS = 280;
const FINAL_STEPS = 3;
const FINAL_ROLL_MS = 130;
const FINAL_PAUSES_MS = [120, 220] as const;
/** 到着で行き過ぎてから戻るまで */
const SETTLE_MS = 500;
/** 到着で行き過ぎる大きさ（年） */
const OVERSHOOT = 0.9;

export function journeyFor(to: Year, currentYear: number): Journey {
  return { from: Math.max(Math.trunc(currentYear), MAX_YEAR + 1), to };
}

/** 跳躍中に止まる年。さかのぼる向きで、作成キットの外観が変わる年 */
export function checkpointYears(to: Year): Year[] {
  const years: Year[] = [];
  for (let year = MAX_YEAR - 1; year > to + FINAL_STEPS; year--) {
    if (uiThemeForYear(year).id !== uiThemeForYear(year + 1).id) years.push(year);
  }
  return years;
}

function travelMs(years: number): number {
  return Math.min(700, Math.max(220, 180 + 90 * years));
}

export function planWarp({ from, to }: Journey): WarpPlan {
  const segments: WarpSegment[] = [];
  const accents: WarpAccent[] = [];
  let t = 0;
  let year = from;
  const move = (toYear: number, ms: number, ease: WarpSegment["ease"], speed: number): void => {
    segments.push({ startMs: t, endMs: t + ms, fromYear: year, toYear, ease, speed });
    t += ms;
    year = toYear;
  };

  const finalStart = to + FINAL_STEPS;
  if (finalStart > MAX_YEAR) {
    move(finalStart, LEAVE_MS, "in", 1.2);
  } else {
    move(MAX_YEAR + 0.5, LEAVE_MS, "in", 1.2);
    accents.push({ atMs: t, kind: "entry", year: MAX_YEAR });
  }
  for (const checkpoint of checkpointYears(to)) {
    move(checkpoint, travelMs(year - checkpoint), "inOut", 0.9);
    accents.push({ atMs: t, kind: "checkpoint", year: checkpoint });
    move(checkpoint, HOLD_MS, "inOut", 0.12);
  }
  if (year > finalStart) move(finalStart, travelMs(year - finalStart), "out", 0.8);
  for (let k = FINAL_STEPS; k >= 1; k--) {
    const next = to + k - 1;
    move(next, FINAL_ROLL_MS, "inOut", 0.3);
    if (k === 1) break;
    accents.push({ atMs: t, kind: next === MAX_YEAR ? "entry" : "tick", year: next });
    move(next, FINAL_PAUSES_MS[FINAL_STEPS - k] ?? 0, "inOut", 0.15);
  }
  return { ms: t, segments, accents };
}

export function fullTimeline(journey: Journey): BootTimeline {
  const warp = planWarp(journey);
  return {
    journey,
    warp,
    phases: [
      { id: "power", ms: PHASE_MS.power },
      { id: "post", ms: PHASE_MS.post },
      { id: "launch", ms: PHASE_MS.launch },
      { id: "warp", ms: warp.ms },
      { id: "arrive", ms: PHASE_MS.arrive },
      { id: "reveal", ms: PHASE_MS.reveal },
    ],
  };
}

/** 動きを減らす設定のときの流れ */
export function calmTimeline(journey: Journey): BootTimeline {
  return {
    journey,
    warp: null,
    phases: [
      { id: "arrive", ms: PHASE_MS.calmArrive },
      { id: "reveal", ms: PHASE_MS.calmReveal },
    ],
  };
}

export function totalMs(timeline: BootTimeline): number {
  return timeline.phases.reduce((sum, phase) => sum + phase.ms, 0);
}

/** 案内に出す、演出の長さ（秒） */
export function durationSeconds(timeline: BootTimeline): number {
  return Math.round(totalMs(timeline) / 1000);
}

/** 場面の始まる時刻。その場面がなければ undefined */
export function phaseStartMs(timeline: BootTimeline, id: BootPhaseId): number | undefined {
  let start = 0;
  for (const phase of timeline.phases) {
    if (phase.id === id) return start;
    start += phase.ms;
  }
  return undefined;
}

export function phaseAt(timeline: BootTimeline, elapsedMs: number): PhaseAt {
  let start = 0;
  for (const phase of timeline.phases) {
    if (elapsedMs < start + phase.ms) {
      const elapsedInPhase = Math.max(0, elapsedMs - start);
      return { id: phase.id, progress: elapsedInPhase / phase.ms, elapsedInPhase };
    }
    start += phase.ms;
  }
  return { id: "done", progress: 1, elapsedInPhase: 0 };
}

const EASE: Record<WarpSegment["ease"], (u: number) => number> = {
  in: (u) => u * u,
  out: (u) => 1 - (1 - u) ** 2,
  inOut: (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2),
};

function segmentAt(plan: WarpPlan, ms: number): WarpSegment | undefined {
  return plan.segments.find((s) => ms < s.endMs) ?? plan.segments.at(-1);
}

function settleYear(ms: number, to: Year): number {
  const p = ms / SETTLE_MS;
  if (p >= 1) return to;
  return to - OVERSHOOT * Math.exp(-6 * p) * Math.sin(2 * Math.PI * 1.3 * p);
}

/** 年カウンターの値（連続値） */
export function yearAt(timeline: BootTimeline, elapsedMs: number): number {
  const { journey, warp } = timeline;
  if (!warp) return journey.to;
  const at = phaseAt(timeline, elapsedMs);
  switch (at.id) {
    case "power":
    case "post":
    case "launch":
      return journey.from;
    case "warp": {
      const segment = segmentAt(warp, at.elapsedInPhase);
      if (!segment) return journey.to;
      const span = segment.endMs - segment.startMs;
      const u = span > 0 ? Math.min(1, (at.elapsedInPhase - segment.startMs) / span) : 1;
      return segment.fromYear + (segment.toYear - segment.fromYear) * EASE[segment.ease](u);
    }
    case "arrive":
      return settleYear(at.elapsedInPhase, journey.to);
    default:
      return journey.to;
  }
}

/** 表示する年 */
export function displayYear(value: number): number {
  return Math.round(value);
}

/** トンネルの流れの速さの目安。跳躍の外では 0 */
export function warpSpeed(timeline: BootTimeline, elapsedMs: number): number {
  const at = phaseAt(timeline, elapsedMs);
  if (at.id !== "warp" || !timeline.warp) return 0;
  return segmentAt(timeline.warp, at.elapsedInPhase)?.speed ?? 0;
}

/** 跳躍中の区切り。時刻は演出の始まりから */
export function warpAccents(timeline: BootTimeline): WarpAccent[] {
  const start = phaseStartMs(timeline, "warp");
  if (start === undefined || !timeline.warp) return [];
  return timeline.warp.accents.map((a) => ({ ...a, atMs: a.atMs + start }));
}

/**
 * 回転式カウンターの 1 桁の位置（0 以上 10 未満）。
 * place は桁（0 が一の位）。下の桁が 9 から 0 へ回るときだけ、上の桁も一緒に回る
 */
export function digitPosition(value: number, place: number): number {
  const base = 10 ** place;
  const whole = Math.floor(value / base);
  const rest = value - whole * base;
  const roll = rest > base - 1 ? rest - (base - 1) : 0;
  return (((whole % 10) + 10) % 10) + roll;
}

/** 表示の年が変わる時刻 */
export function yearChangeTimes(
  timeline: BootTimeline,
  stepMs = 2,
): { atMs: number; year: number }[] {
  const changes: { atMs: number; year: number }[] = [];
  const end = totalMs(timeline);
  let shown = displayYear(yearAt(timeline, 0));
  for (let t = stepMs; t <= end; t += stepMs) {
    const year = displayYear(yearAt(timeline, t));
    if (year !== shown) {
      changes.push({ atMs: t, year });
      shown = year;
    }
  }
  return changes;
}
