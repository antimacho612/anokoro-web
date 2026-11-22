import { SRC } from "./sources.ts";
import type { Source, Year } from "./years.ts";

export type UiThemeId =
  | "gray-bevel"
  | "gray-gradient"
  | "blue-round"
  | "glass"
  | "flat-bold"
  | "flat-thin";

/** 作成キットの外観。その年に新しく出た OS の外観の雰囲気を写す */
export interface UiThemeEntry {
  id: UiThemeId;
  /** 日本での発売年 */
  from: Year;
  sources: readonly Source[];
}

/** 古い順。次の行の `from` の前年まで続く */
export const UI_THEMES: readonly UiThemeEntry[] = [
  { id: "gray-bevel", from: 1995, sources: [SRC.win95] },
  { id: "gray-gradient", from: 1998, sources: [SRC.win98] },
  { id: "blue-round", from: 2001, sources: [SRC.winXp] },
  { id: "glass", from: 2007, sources: [SRC.winVista] },
  { id: "flat-bold", from: 2012, sources: [SRC.win8] },
  { id: "flat-thin", from: 2015, sources: [SRC.win10] },
];

export function uiThemeForYear(year: Year): UiThemeEntry {
  const theme = UI_THEMES.findLast((t) => t.from <= year);
  if (!theme) throw new Error(`${year} 年の外観がありません`);
  return theme;
}
