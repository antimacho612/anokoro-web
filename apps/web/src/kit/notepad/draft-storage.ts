import { z } from "zod";
import type { LastOpened } from "../sites/workspace.ts";

/** 最後に開いていたサイトとページ。M1 では書きかけの HTML をそのまま入れていた */
const DRAFT_KEY = "anokoro:draft";

/** localStorage の取得そのものが例外を投げる環境があるため、取得を関数で受け取る */
export type StorageAccess = () => Pick<Storage, "getItem" | "setItem">;

const lastOpenedSchema = z.object({ siteId: z.string().min(1), path: z.string().min(1) });

function readDraft(storage: StorageAccess): string | undefined {
  try {
    return storage().getItem(DRAFT_KEY) || undefined;
  } catch {
    return undefined;
  }
}

function parseLastOpened(raw: string): LastOpened | undefined {
  try {
    const result = lastOpenedSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export type SavedDraft =
  | { kind: "none" }
  | { kind: "last-opened"; lastOpened: LastOpened }
  /** M1 で保存した、書きかけの HTML */
  | { kind: "legacy-html"; html: string };

export function loadDraft(storage: StorageAccess): SavedDraft {
  const raw = readDraft(storage);
  if (raw === undefined) return { kind: "none" };
  const lastOpened = parseLastOpened(raw);
  return lastOpened ? { kind: "last-opened", lastOpened } : { kind: "legacy-html", html: raw };
}

export function saveLastOpened(storage: StorageAccess, lastOpened: LastOpened): void {
  try {
    storage().setItem(DRAFT_KEY, JSON.stringify(lastOpened));
  } catch {
    // 容量超過やストレージの無効化では保存をあきらめる
  }
}
