import { LINES, MAX_YEAR, MIN_YEAR } from "@anokoro/era-data";
import type { Journey } from "./boot-timeline.ts";

/** BIOS 風の自己診断の 1 行。時刻は自己診断の場面の始まりから */
export interface PostLine {
  key: string;
  atMs: number;
  label: string;
  value?: string;
  result?: { atMs: number; text: string };
  /** dest: 行き先を反転して強調する / go: 跳躍の合図 */
  tone?: "title" | "dim" | "dest" | "go";
  /** 値を毎フレーム書き換える行 */
  live?: "memory";
}

const MEMORY_FROM_MS = 220;
const MEMORY_UNTIL_MS = 640;
/** 行き先を強調する時刻。ここから跳躍の合図までが溜め */
const DEST_AT_MS = 1100;
export const GO_AT_MS = 1380;

export function postLines({ to }: Journey): PostLine[] {
  return [
    { key: "title", atMs: 0, label: "タイムマシン BIOS Ver.1.995", tone: "title" },
    { key: "copyright", atMs: 80, label: "(C) あのころ Web", tone: "dim" },
    {
      key: "memory",
      atMs: MEMORY_FROM_MS,
      label: "思い出メモリ",
      value: memoryText(MEMORY_FROM_MS),
      result: { atMs: 680, text: "OK" },
      live: "memory",
    },
    {
      key: "line",
      atMs: 760,
      label: "回線装置",
      value: `${LINES.length} 種類`,
      result: { atMs: 860, text: "検出" },
    },
    { key: "jump", atMs: 920, label: "跳躍装置", result: { atMs: 1000, text: "正常" } },
    { key: "dest", atMs: DEST_AT_MS, label: "行き先", value: `${to} 年`, tone: "dest" },
    { key: "go", atMs: GO_AT_MS, label: "跳躍を開始します", tone: "go" },
  ];
}

/** 思い出メモリの検査で数え上げる年 */
export function memoryText(msIntoPost: number): string {
  const t = Math.min(
    1,
    Math.max(0, (msIntoPost - MEMORY_FROM_MS) / (MEMORY_UNTIL_MS - MEMORY_FROM_MS)),
  );
  const year = Math.round(MIN_YEAR + (MAX_YEAR - MIN_YEAR) * t);
  return `${MIN_YEAR}〜${year} 年`;
}
