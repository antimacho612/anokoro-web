import { parseSiteId, type SiteId } from "@anokoro/site-store";
import { describe, expect, it } from "vite-plus/test";
import { loadDraft, saveLastOpened } from "./draft-storage.ts";
import { type StorageAccess } from "../../../shared/lib/index.ts";

const testId = (n: number): SiteId => parseSiteId(`01J${String(n).padStart(23, "0")}`);

function memoryStorage(): { access: StorageAccess; data: Map<string, string> } {
  const data = new Map<string, string>();
  return {
    data,
    access: () => ({
      getItem: (k) => data.get(k) ?? null,
      setItem: (k, v) => void data.set(k, v),
    }),
  };
}

const broken: StorageAccess = () => {
  throw new Error("SecurityError");
};

describe("最後に開いていたページ", () => {
  it("anokoro:draft に保存して読み出す", () => {
    const { access, data } = memoryStorage();
    expect(loadDraft(access)).toEqual({ kind: "none" });
    saveLastOpened(access, { siteId: testId(1), path: "diary.html" });
    expect(JSON.parse(data.get("anokoro:draft") ?? "")).toEqual({
      siteId: testId(1),
      path: "diary.html",
    });
    expect(loadDraft(access)).toEqual({
      kind: "last-opened",
      lastOpened: { siteId: testId(1), path: "diary.html" },
    });
  });

  it("M1 の書きかけの HTML はそのまま返す", () => {
    const { access, data } = memoryStorage();
    data.set("anokoro:draft", "<html>");
    expect(loadDraft(access)).toEqual({ kind: "legacy-html", html: "<html>" });
    data.set("anokoro:draft", '{"x":1}');
    expect(loadDraft(access)).toEqual({ kind: "legacy-html", html: '{"x":1}' });
    data.set("anokoro:draft", "");
    expect(loadDraft(access)).toEqual({ kind: "none" });
  });

  it("ストレージが使えなくても例外を投げない", () => {
    expect(loadDraft(broken)).toEqual({ kind: "none" });
    expect(() => saveLastOpened(broken, { siteId: testId(2), path: "b" })).not.toThrow();
  });
});
