import { SRC } from "./sources.ts";
import { inRange, type Source, type Year, type YearRange } from "./years.ts";

export type LineKey = "m28" | "m56" | "isdn" | "adsl1" | "adsl12" | "hikari";

/** modem: モデムでダイヤル / isdn: ISDN でダイヤル / always: 常時接続 */
export type DialKind = "modem" | "isdn" | "always";

export interface LineEntry {
  key: LineKey;
  /** 表示名 */
  name: string;
  /** 実効速度（バイト/秒）。公称速度ではなく体感を優先した調整値 */
  bytesPerSec: number;
  /** 応答遅延（ms） */
  latencyMs: number;
  dial: DialKind;
  /** 接続後に表示する速度。常時接続では null */
  connectedLabel: string | null;
  availableYears: YearRange;
  /** 既定の回線になる年の範囲 */
  defaultYears: YearRange | null;
  sources: readonly Source[];
}

export const LINES: readonly LineEntry[] = [
  {
    key: "m28",
    name: "28.8kモデム",
    bytesPerSec: 3000,
    latencyMs: 400,
    dial: "modem",
    connectedLabel: "28.8Kbps",
    availableYears: [1995, 2000],
    defaultYears: [1995, 1997],
    sources: [SRC.modem, SRC.telehoudai, SRC.v90],
  },
  {
    key: "m56",
    name: "56kモデム",
    bytesPerSec: 4500,
    latencyMs: 300,
    dial: "modem",
    connectedLabel: "53.3Kbps",
    availableYears: [1998, 2007],
    defaultYears: [1998, 1999],
    sources: [SRC.modem, SRC.broadband2009],
  },
  {
    key: "isdn",
    name: "ISDN 64k",
    bytesPerSec: 7600,
    latencyMs: 150,
    dial: "isdn",
    connectedLabel: "64Kbps",
    availableYears: [1995, 2005],
    defaultYears: [2000, 2000],
    sources: [SRC.ins, SRC.isdnDecline2005],
  },
  {
    key: "adsl1",
    name: "ADSL 1.5M",
    bytesPerSec: 110000,
    latencyMs: 60,
    dial: "always",
    connectedLabel: null,
    availableYears: [2001, 2006],
    defaultYears: [2001, 2002],
    sources: [SRC.adsl, SRC.yahooBB, SRC.adsl12m2002],
  },
  {
    key: "adsl12",
    name: "ADSL 12M",
    bytesPerSec: 500000,
    latencyMs: 40,
    dial: "always",
    connectedLabel: null,
    availableYears: [2002, 2015],
    defaultYears: [2003, 2006],
    sources: [SRC.adsl, SRC.yahooBB, SRC.broadband2009],
  },
  {
    key: "hikari",
    name: "光ファイバー 100M",
    bytesPerSec: 3000000,
    latencyMs: 15,
    dial: "always",
    connectedLabel: null,
    availableYears: [2001, 2015],
    defaultYears: [2007, 2015],
    sources: [SRC.ftth, SRC.bflets],
  },
];

const byKey = new Map(LINES.map((line) => [line.key, line]));

export function getLine(key: LineKey): LineEntry {
  const line = byKey.get(key);
  if (!line) throw new Error(`未知の回線です: ${key}`);
  return line;
}

export function isLineKey(value: unknown): value is LineKey {
  return typeof value === "string" && byKey.has(value as LineKey);
}

/** その年に選べる回線（表の順） */
export function linesForYear(year: Year): LineEntry[] {
  return LINES.filter((line) => inRange(year, line.availableYears));
}

/** その年の既定の回線 */
export function defaultLineForYear(year: Year): LineEntry {
  const line = LINES.find((l) => l.defaultYears !== null && inRange(year, l.defaultYears));
  if (!line) throw new Error(`${year} 年の既定の回線がありません`);
  return line;
}
