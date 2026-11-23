import { siteIdSchema } from "@anokoro/site-store";
import { z } from "zod";
import type { LastOpened } from "../sites/workspace.ts";

const LAST_OPENED_KEY = "anokoro:draft";

/** localStorage の取得そのものが例外を投げる環境があるため、取得を関数で受け取る */
export type StorageAccess = () => Pick<Storage, "getItem" | "setItem">;

const lastOpenedSchema = z.object({ siteId: siteIdSchema, path: z.string().min(1) });

function readDraft(storage: StorageAccess): string | undefined {
  try {
    return storage().getItem(LAST_OPENED_KEY) || undefined;
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
  | { kind: "legacy-html"; html: string };

export function loadDraft(storage: StorageAccess): SavedDraft {
  const raw = readDraft(storage);
  if (raw === undefined) return { kind: "none" };
  const lastOpened = parseLastOpened(raw);
  return lastOpened ? { kind: "last-opened", lastOpened } : { kind: "legacy-html", html: raw };
}

export function saveLastOpened(storage: StorageAccess, lastOpened: LastOpened): void {
  try {
    storage().setItem(LAST_OPENED_KEY, JSON.stringify(lastOpened));
  } catch {}
}
