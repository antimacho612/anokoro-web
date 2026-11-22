import { MAX_YEAR, uiThemeForYear, type Year } from "@anokoro/era-data";

export type BootPhaseId = "powerOn" | "selfTest" | "diveIn" | "warp" | "arrive" | "revealDesktop";

export interface BootPhase {
  id: BootPhaseId;
  ms: number;
}

export interface Journey {
  from: number;
  to: Year;
}

export interface WarpSegment {
  startMsInWarp: number;
  endMsInWarp: number;
  fromYear: number;
  toYear: number;
  ease: "in" | "out" | "inOut";
  speed: number;
}

export type WarpAccentKind = "enterSupportedRange" | "themeCheckpoint" | "finalStep";

export interface WarpAccent {
  atMsInWarp: number;
  kind: WarpAccentKind;
  year: number;
}

export interface BootAccent {
  atMsFromBoot: number;
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
  progressRatio: number;
  elapsedInPhase: number;
}

export const PHASE_MS = {
  powerOn: 500,
  selfTest: 1700,
  diveIn: 500,
  arrive: 1400,
  revealDesktop: 900,
  reducedMotionArrive: 1600,
  reducedMotionReveal: 500,
} as const;

const LEAVE_MS = 450;
const HOLD_MS = 280;
const FINAL_STEPS = 3;
const FINAL_ROLL_MS = 130;
const FINAL_PAUSES_MS = [120, 220] as const;
const OVERSHOOT_SETTLE_MS = 500;
const OVERSHOOT_YEARS = 0.9;

export function journeyFor(to: Year, currentYear: number): Journey {
  return { from: Math.max(Math.trunc(currentYear), MAX_YEAR + 1), to };
}

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
    segments.push({ startMsInWarp: t, endMsInWarp: t + ms, fromYear: year, toYear, ease, speed });
    t += ms;
    year = toYear;
  };

  const finalStart = to + FINAL_STEPS;
  if (finalStart > MAX_YEAR) {
    move(finalStart, LEAVE_MS, "in", 1.2);
  } else {
    move(MAX_YEAR + 0.5, LEAVE_MS, "in", 1.2);
    accents.push({ atMsInWarp: t, kind: "enterSupportedRange", year: MAX_YEAR });
  }
  for (const checkpoint of checkpointYears(to)) {
    move(checkpoint, travelMs(year - checkpoint), "inOut", 0.9);
    accents.push({ atMsInWarp: t, kind: "themeCheckpoint", year: checkpoint });
    move(checkpoint, HOLD_MS, "inOut", 0.12);
  }
  if (year > finalStart) move(finalStart, travelMs(year - finalStart), "out", 0.8);
  for (let k = FINAL_STEPS; k >= 1; k--) {
    const next = to + k - 1;
    move(next, FINAL_ROLL_MS, "inOut", 0.3);
    if (k === 1) break;
    accents.push({
      atMsInWarp: t,
      kind: next === MAX_YEAR ? "enterSupportedRange" : "finalStep",
      year: next,
    });
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
      { id: "powerOn", ms: PHASE_MS.powerOn },
      { id: "selfTest", ms: PHASE_MS.selfTest },
      { id: "diveIn", ms: PHASE_MS.diveIn },
      { id: "warp", ms: warp.ms },
      { id: "arrive", ms: PHASE_MS.arrive },
      { id: "revealDesktop", ms: PHASE_MS.revealDesktop },
    ],
  };
}

export function reducedMotionTimeline(journey: Journey): BootTimeline {
  return {
    journey,
    warp: null,
    phases: [
      { id: "arrive", ms: PHASE_MS.reducedMotionArrive },
      { id: "revealDesktop", ms: PHASE_MS.reducedMotionReveal },
    ],
  };
}

export function totalMs(timeline: BootTimeline): number {
  return timeline.phases.reduce((sum, phase) => sum + phase.ms, 0);
}

export function durationSeconds(timeline: BootTimeline): number {
  return Math.round(totalMs(timeline) / 1000);
}

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
      return { id: phase.id, progressRatio: elapsedInPhase / phase.ms, elapsedInPhase };
    }
    start += phase.ms;
  }
  return { id: "done", progressRatio: 1, elapsedInPhase: 0 };
}

const EASE: Record<WarpSegment["ease"], (u: number) => number> = {
  in: (u) => u * u,
  out: (u) => 1 - (1 - u) ** 2,
  inOut: (u) => (u < 0.5 ? 2 * u * u : 1 - (-2 * u + 2) ** 2 / 2),
};

function segmentAt(plan: WarpPlan, msInWarp: number): WarpSegment | undefined {
  return plan.segments.find((s) => msInWarp < s.endMsInWarp) ?? plan.segments.at(-1);
}

function settleYear(ms: number, to: Year): number {
  const p = ms / OVERSHOOT_SETTLE_MS;
  if (p >= 1) return to;
  return to - OVERSHOOT_YEARS * Math.exp(-6 * p) * Math.sin(2 * Math.PI * 1.3 * p);
}

export function yearValueAt(timeline: BootTimeline, elapsedMs: number): number {
  const { journey, warp } = timeline;
  if (!warp) return journey.to;
  const at = phaseAt(timeline, elapsedMs);
  switch (at.id) {
    case "powerOn":
    case "selfTest":
    case "diveIn":
      return journey.from;
    case "warp": {
      const segment = segmentAt(warp, at.elapsedInPhase);
      if (!segment) return journey.to;
      const span = segment.endMsInWarp - segment.startMsInWarp;
      const u = span > 0 ? Math.min(1, (at.elapsedInPhase - segment.startMsInWarp) / span) : 1;
      return segment.fromYear + (segment.toYear - segment.fromYear) * EASE[segment.ease](u);
    }
    case "arrive":
      return settleYear(at.elapsedInPhase, journey.to);
    default:
      return journey.to;
  }
}

export function displayYear(value: number): number {
  return Math.round(value);
}

export function warpSpeed(timeline: BootTimeline, elapsedMs: number): number {
  const at = phaseAt(timeline, elapsedMs);
  if (at.id !== "warp" || !timeline.warp) return 0;
  return segmentAt(timeline.warp, at.elapsedInPhase)?.speed ?? 0;
}

export function warpAccents(timeline: BootTimeline): BootAccent[] {
  const start = phaseStartMs(timeline, "warp");
  if (start === undefined || !timeline.warp) return [];
  return timeline.warp.accents.map(({ atMsInWarp, kind, year }) => ({
    atMsFromBoot: atMsInWarp + start,
    kind,
    year,
  }));
}

export function odometerDigitPosition(value: number, placeFromOnes: number): number {
  const base = 10 ** placeFromOnes;
  const whole = Math.floor(value / base);
  const rest = value - whole * base;
  const roll = rest > base - 1 ? rest - (base - 1) : 0;
  return (((whole % 10) + 10) % 10) + roll;
}

export function yearChangeTimes(
  timeline: BootTimeline,
  stepMs = 2,
): { atMs: number; year: number }[] {
  const changes: { atMs: number; year: number }[] = [];
  const end = totalMs(timeline);
  let shown = displayYear(yearValueAt(timeline, 0));
  for (let t = stepMs; t <= end; t += stepMs) {
    const year = displayYear(yearValueAt(timeline, t));
    if (year !== shown) {
      changes.push({ atMs: t, year });
      shown = year;
    }
  }
  return changes;
}
