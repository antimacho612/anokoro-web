import type { QuizPage, QuizTrick, SlotKind, TrickInsert } from "./types.ts";

const SLOT_PATTERN = /\{\{quiz:(block|inline|style|attr:(?:input|img|a|table))\}\}/g;

/** 目印だけの行。仕掛けを入れないときは行ごと消す */
const SLOT_ONLY_LINE = /^[\t ]*\{\{quiz:[^}]+\}\}[\t ]*$/;

export interface QuizSlot {
  /** お題の中での順番（0 始まり） */
  index: number;
  kind: SlotKind;
}

/** 組み立てた問題のソース */
export interface AssembledQuiz {
  source: string;
  /** 仕掛けを入れた行（1 始まり）。仕掛けがなければ null */
  answerLine: number | null;
}

export interface Placement {
  trick: QuizTrick;
  /** 差し込み口の順番（QuizSlot.index） */
  slot: number;
}

function isSlotKind(value: string | undefined): value is SlotKind {
  return (
    value === "block" ||
    value === "inline" ||
    value === "style" ||
    value === "attr:input" ||
    value === "attr:img" ||
    value === "attr:a" ||
    value === "attr:table"
  );
}

export function listSlots(page: QuizPage): QuizSlot[] {
  return [...page.source.matchAll(SLOT_PATTERN)].flatMap((m, index) => {
    const kind = m[1];
    return isSlotKind(kind) ? [{ index, kind }] : [];
  });
}

export function slotKindOf(insert: TrickInsert): SlotKind {
  switch (insert.kind) {
    case "element":
      return insert.slot;
    case "attribute":
      return `attr:${insert.tag}`;
    case "style":
      return "style";
    default: {
      const exhaustive: never = insert;
      return exhaustive;
    }
  }
}

/** その仕掛けを入れられる差し込み口 */
export function slotsFor(page: QuizPage, trick: QuizTrick): QuizSlot[] {
  const kind = slotKindOf(trick.insert);
  return listSlots(page).filter((s) => s.kind === kind);
}

function escapeAttribute(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function renderInsert(insert: TrickInsert): string {
  switch (insert.kind) {
    case "element":
      return insert.html;
    case "attribute":
      return insert.value === undefined
        ? ` ${insert.name}`
        : ` ${insert.name}="${escapeAttribute(insert.value)}"`;
    case "style":
      return ` style="${escapeAttribute(insert.declarations)}"`;
    default: {
      const exhaustive: never = insert;
      return exhaustive;
    }
  }
}

/**
 * お題に仕掛けを入れ、差し込み口の目印を取り除いたソースを返す。
 * placement を省くと仕掛けなしのソースになる。
 */
export function assembleQuiz(page: QuizPage, placement?: Placement): AssembledQuiz {
  if (placement !== undefined) {
    const slot = listSlots(page)[placement.slot];
    if (slot === undefined || slot.kind !== slotKindOf(placement.trick.insert)) {
      throw new RangeError(
        `お題 ${page.id} の差し込み口 ${placement.slot} に仕掛け ${placement.trick.id} は入れられません`,
      );
    }
  }
  const lines = page.source.split("\n");
  const out: string[] = [];
  let slotIndex = 0;
  let answerLine: number | null = null;

  for (const line of lines) {
    let hit = false;
    const replaced = line.replace(SLOT_PATTERN, () => {
      const index = slotIndex++;
      if (placement?.slot !== index) return "";
      hit = true;
      return renderInsert(placement.trick.insert);
    });
    if (!hit && SLOT_ONLY_LINE.test(line)) continue;
    out.push(replaced);
    if (hit) answerLine = out.length;
  }

  return { source: out.join("\n"), answerLine };
}
