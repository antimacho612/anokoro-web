import {
  clampYear,
  FEATURES,
  LINES,
  RESOLUTION_PERIODS,
  featureStatus,
  formatResolution,
  inRange,
  resolutionPeriodForYear,
  type FeatureId,
  type LineKey,
  type Year,
} from "@anokoro/era-data";
import { createRandom } from "@anokoro/shared";
import { displayYear, phaseStartMs, yearValueAt, type BootTimeline } from "./boot-timeline.ts";

export type FragmentToken =
  | { kind: "code"; text: string; feature: FeatureId }
  | { kind: "line"; text: string; line: LineKey }
  | { kind: "resolution"; text: string }
  | { kind: "counter"; text: string }
  | { kind: "image"; asset: FragmentAsset };

export type FragmentAsset = "koji.gif" | "new.gif";

const IMAGE_ASSETS: readonly FragmentAsset[] = ["koji.gif", "new.gif"];

const CODE_TOKENS: Partial<Record<FeatureId, readonly string[]>> = {
  "html.basic": ["<table>", "<font color>", "<center>", "<img src>"],
  "html.table-bgcolor": ["<td bgcolor>"],
  "html.frameset": ["<frameset>"],
  "html.marquee": ["<marquee>"],
  "html.blink": ["<blink>"],
  "html5.semantic": ["<section>", "<header>"],
  "html5.video": ["<video>"],
  "html5.canvas": ["<canvas>"],
  "html5.svg": ["<svg>"],
  "js.dhtml": ["onmouseover"],
  "css.basic": ["<style>", "color: red;"],
  "css.selector.hover-any": [":hover"],
  "css.position-fixed": ["position: fixed"],
  "css.box-sizing": ["box-sizing"],
  "css.flex": ["display: flex"],
  "css.border-radius": ["border-radius"],
  "css.box-shadow": ["box-shadow"],
  "css.text-shadow": ["text-shadow"],
  "css.opacity": ["opacity"],
  "css.rgba": ["rgba()"],
  "css.gradient": ["linear-gradient"],
  "css.calc": ["calc()"],
  "css.transform": ["transform"],
  "css.transition": ["transition"],
  "css.animation": ["@keyframes"],
  "css.media-queries": ["@media"],
  "css.font-face": ["@font-face"],
};

const codeEntries = Object.entries(CODE_TOKENS) as [FeatureId, readonly string[]][];

function codeTokens(id: FeatureId): FragmentToken[] {
  return (CODE_TOKENS[id] ?? []).map((text) => ({ kind: "code", text, feature: id }));
}

export function tokensForYear(year: Year): FragmentToken[] {
  const code = codeEntries
    .filter(([id]) => featureStatus(id, year) === "available")
    .flatMap(([id]) => codeTokens(id));
  const lines: FragmentToken[] = LINES.filter((l) => inRange(year, l.availableYears)).map((l) => ({
    kind: "line",
    text: l.name,
    line: l.key,
  }));
  const resolution: FragmentToken = {
    kind: "resolution",
    text: formatResolution(resolutionPeriodForYear(year).default),
  };
  return [...code, ...lines, resolution];
}

export function tokensIntroducedIn(year: Year): FragmentToken[] {
  const code = codeEntries
    .filter(([id]) => FEATURES[id].availableFrom === year)
    .flatMap(([id]) => codeTokens(id));
  const lines: FragmentToken[] = LINES.filter((l) => l.availableYears[0] === year).map((l) => ({
    kind: "line",
    text: l.name,
    line: l.key,
  }));
  const resolutions: FragmentToken[] = RESOLUTION_PERIODS.filter((p) => p.years[0] === year).map(
    (p) => ({ kind: "resolution", text: formatResolution(p.default) }),
  );
  return [...code, ...lines, ...resolutions];
}

export interface PlannedFragment {
  atMsFromBoot: number;
  year: Year;
  token: FragmentToken;
  angleRad: number;
  radiusRatio: number;
  tilt: number;
}

export const FRAGMENT_INTERVAL_MS = 70;
const PLAN_UNTIL_WARP_RATIO = 0.9;
const FILLER_CHANCE = 0.16;
const RECENT_LIMIT = 4;

function tokenKey(token: FragmentToken): string {
  return token.kind === "image" ? token.asset : token.text;
}

function filler(random: () => number): FragmentToken {
  if (random() < 0.5) {
    return { kind: "image", asset: IMAGE_ASSETS[Math.floor(random() * IMAGE_ASSETS.length)]! };
  }
  const count = String(Math.floor(random() * 99_999)).padStart(7, "0");
  return { kind: "counter", text: count };
}

export function planFragments(timeline: BootTimeline, seed: number): PlannedFragment[] {
  const start = phaseStartMs(timeline, "warp");
  const warp = timeline.phases.find((p) => p.id === "warp");
  if (start === undefined || !warp) return [];

  const random = createRandom(seed);
  const planned: PlannedFragment[] = [];
  const recent: string[] = [];
  let queue: FragmentToken[] = [];
  let queuedYear: number | null = null;

  for (let t = start; t < start + warp.ms * PLAN_UNTIL_WARP_RATIO; t += FRAGMENT_INTERVAL_MS) {
    const year = clampYear(displayYear(yearValueAt(timeline, t)));
    if (year !== queuedYear) {
      queue = tokensIntroducedIn(year);
      queuedYear = year;
    }

    let token = queue.shift();
    if (!token) {
      if (random() < FILLER_CHANCE) {
        token = filler(random);
      } else {
        const candidates = tokensForYear(year).filter((c) => !recent.includes(tokenKey(c)));
        token = candidates[Math.floor(random() * candidates.length)];
      }
    }
    if (!token) continue;

    recent.push(tokenKey(token));
    if (recent.length > RECENT_LIMIT) recent.shift();
    planned.push({
      atMsFromBoot: t,
      year,
      token,
      angleRad: random() * Math.PI * 2,
      radiusRatio: 0.35 + random() * 0.65,
      tilt: (random() - 0.5) * 0.5,
    });
  }
  return planned;
}
