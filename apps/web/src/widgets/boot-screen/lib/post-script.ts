import { LINES, MAX_YEAR, MIN_YEAR } from "@anokoro/era-data";
import type { Journey } from "./boot-timeline.ts";

export interface PostLine {
  key: string;
  atMsInSelfTest: number;
  label: string;
  value?: string;
  result?: { atMsInSelfTest: number; text: string };
  tone?: "title" | "dim" | "highlightedDestination" | "warpCue";
  live?: "memory";
}

const MEMORY_FROM_MS = 220;
const MEMORY_UNTIL_MS = 640;
const DEST_AT_MS = 1100;
export const GO_AT_MS = 1380;

export function postLines({ to }: Journey): PostLine[] {
  return [
    { key: "title", atMsInSelfTest: 0, label: "タイムマシン BIOS Ver.1.995", tone: "title" },
    { key: "copyright", atMsInSelfTest: 80, label: "(C) あのころ Web", tone: "dim" },
    {
      key: "memory",
      atMsInSelfTest: MEMORY_FROM_MS,
      label: "思い出メモリ",
      value: memoryText(MEMORY_FROM_MS),
      result: { atMsInSelfTest: 680, text: "OK" },
      live: "memory",
    },
    {
      key: "line",
      atMsInSelfTest: 760,
      label: "回線装置",
      value: `${LINES.length} 種類`,
      result: { atMsInSelfTest: 860, text: "検出" },
    },
    {
      key: "jump",
      atMsInSelfTest: 920,
      label: "跳躍装置",
      result: { atMsInSelfTest: 1000, text: "正常" },
    },
    {
      key: "dest",
      atMsInSelfTest: DEST_AT_MS,
      label: "行き先",
      value: `${to} 年`,
      tone: "highlightedDestination",
    },
    { key: "go", atMsInSelfTest: GO_AT_MS, label: "跳躍を開始します", tone: "warpCue" },
  ];
}

export function memoryText(msIntoPost: number): string {
  const t = Math.min(
    1,
    Math.max(0, (msIntoPost - MEMORY_FROM_MS) / (MEMORY_UNTIL_MS - MEMORY_FROM_MS)),
  );
  const year = Math.round(MIN_YEAR + (MAX_YEAR - MIN_YEAR) * t);
  return `${MIN_YEAR}〜${year} 年`;
}
