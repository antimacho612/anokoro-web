import type { TopicId } from "@anokoro/era-checker";
import {
  SITE_KINDS,
  eraRefYears,
  formatResolution,
  resolutionPeriodForYear,
  type EraRef,
  type SiteKindId,
  type Year,
} from "@anokoro/era-data";
import { PARTS } from "./part-list.ts";

export interface PartBase {
  label: string;
  /**
   * 挿入する HTML。{{year}} は選んだ年、{{yy}} はその下 2 桁、{{weekday}} はその年の 11 月 18 日の曜日、
   * {{resolution}} はその年の既定の解像度に置き換える
   */
  code: string | ((year: Year) => string);
  tip: string;
  tipTopic: TopicId;
}

export type PartCategory = "deco" | "layout" | "navi" | "social" | "notice" | "media" | "mobile";

export interface Part extends PartBase {
  /** よく使われた年。この年より前は灰色にする */
  era: EraRef;
  category: PartCategory;
  /** その種類のサイトでだけ出すパーツ。なければどの種類でも出す */
  kinds?: readonly SiteKindId[];
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

/** 選んだ年に合わせて、挿入する HTML を作る */
export function partCode(part: PartBase, year: Year): string {
  const code = typeof part.code === "function" ? part.code(year) : part.code;
  const weekday = WEEKDAYS[new Date(Date.UTC(year, 10, 18)).getUTCDay()] ?? "";
  return code
    .replaceAll("{{year}}", String(year))
    .replaceAll("{{yy}}", String(year % 100).padStart(2, "0"))
    .replaceAll("{{weekday}}", weekday)
    .replaceAll("{{resolution}}", formatResolution(resolutionPeriodForYear(year).default));
}

export type PartStatus =
  | { kind: "popular" }
  | { kind: "past"; label: string }
  | { kind: "future"; label: string };

/** 選んだ年に、そのパーツがよく使われていたか */
export function partStatus(part: Part, year: Year): PartStatus {
  const years = eraRefYears(part.era);
  if (!years) return { kind: "future", label: "まだ使えません" };
  const [from, to] = years;
  if (year < from) return { kind: "future", label: `${from}年から` };
  if (year > to) return { kind: "past", label: `〜${to}年` };
  return { kind: "popular" };
}

export interface PartGroup {
  key: string;
  label: string;
  parts: readonly Part[];
}

export interface LabeledPart {
  part: Part;
  /** 「〜2007年」「1996年から」のような年の表示 */
  label: string;
}

export interface PartShelf {
  /** その年によく使われたパーツ。サイトの種類のパーツを先に並べる */
  popular: readonly PartGroup[];
  /** 流行が過ぎたパーツ。挿入はできる */
  past: readonly LabeledPart[];
  /** まだないパーツ。灰色にする */
  future: readonly LabeledPart[];
}

const CATEGORY_LABELS: Readonly<Record<PartCategory, string>> = {
  deco: "文字と飾り",
  layout: "レイアウト",
  navi: "メニューとリンク",
  social: "交流",
  notice: "お知らせと注意書き",
  media: "音と動き",
  mobile: "ケータイとスマホ",
};

/** そのサイトの種類で出すパーツ。種類に合わせたパーツを先に並べる */
export function partsForKind(kind: SiteKindId): Part[] {
  const own = PARTS.filter((p) => p.kinds?.includes(kind));
  const common = PARTS.filter((p) => p.kinds === undefined);
  return [...own, ...common];
}

/** パーツ箱に並べる形。よく使われたものを種類ごとにまとめ、流行の前後を分ける */
export function partShelf(kind: SiteKindId, year: Year): PartShelf {
  const popular: Part[] = [];
  const past: LabeledPart[] = [];
  const future: LabeledPart[] = [];
  for (const part of partsForKind(kind)) {
    const status = partStatus(part, year);
    if (status.kind === "popular") popular.push(part);
    else if (status.kind === "past") past.push({ part, label: status.label });
    else future.push({ part, label: status.label });
  }
  const own = popular.filter((p) => p.kinds !== undefined);
  const common = popular.filter((p) => p.kinds === undefined);
  const groups: PartGroup[] = [
    { key: "kind", label: `${SITE_KINDS[kind].label}のパーツ`, parts: own },
    ...Object.entries(CATEGORY_LABELS).map(([category, label]) => ({
      key: category,
      label,
      parts: common.filter((p) => p.category === category),
    })),
  ];
  return {
    popular: groups.filter((g) => g.parts.length > 0),
    past,
    future,
  };
}
