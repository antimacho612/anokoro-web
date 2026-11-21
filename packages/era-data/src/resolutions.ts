import { SRC } from "./sources.ts";
import { inRange, type Source, type Year, type YearRange } from "./years.ts";

export interface Resolution {
  width: number;
  height: number;
}

export interface ResolutionPeriod {
  years: YearRange;
  candidates: readonly Resolution[];
  default: Resolution;
  sources: readonly Source[];
}

const r = (width: number, height: number): Resolution => ({ width, height });

export const RESOLUTION_PERIODS: readonly ResolutionPeriod[] = [
  {
    years: [1995, 1998],
    candidates: [r(640, 480), r(800, 600)],
    default: r(640, 480),
    sources: [SRC.w3schoolsDisplay],
  },
  {
    years: [1999, 2003],
    candidates: [r(640, 480), r(800, 600), r(1024, 768)],
    default: r(800, 600),
    sources: [SRC.w3schoolsDisplay],
  },
  {
    years: [2004, 2008],
    candidates: [r(800, 600), r(1024, 768), r(1280, 1024)],
    default: r(1024, 768),
    sources: [SRC.w3schoolsDisplay],
  },
  {
    years: [2009, 2012],
    candidates: [r(1024, 768), r(1280, 800), r(1366, 768)],
    default: r(1366, 768),
    sources: [SRC.w3schoolsDisplay, SRC.statcounterJp],
  },
  {
    years: [2013, 2015],
    candidates: [r(1024, 768), r(1366, 768), r(1920, 1080)],
    default: r(1366, 768),
    sources: [SRC.w3schoolsDisplay, SRC.statcounterJp],
  },
];

export function resolutionPeriodForYear(year: Year): ResolutionPeriod {
  const period = RESOLUTION_PERIODS.find((p) => inRange(year, p.years));
  if (!period) throw new Error(`${year} 年の解像度がありません`);
  return period;
}

/** 表示用の文字列（例: 800×600） */
export function formatResolution({ width, height }: Resolution): string {
  return `${width}×${height}`;
}
