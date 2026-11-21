import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "../store.ts";
import { loadDraft, persistDraft, type StorageAccess } from "./draft-storage.ts";

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

describe("下書きの保存", () => {
  it("ローカル表示を更新したときに anokoro:draft へ保存する", () => {
    const { access, data } = memoryStorage();
    const store = createKitStore();
    persistDraft(store, access);
    store.getState().edit("<p>途中");
    expect(data.has("anokoro:draft")).toBe(false);
    store.getState().show();
    expect(data.get("anokoro:draft")).toBe("<p>途中");
  });

  it("保存した下書きを読む。空なら undefined", () => {
    const { access, data } = memoryStorage();
    expect(loadDraft(access)).toBeUndefined();
    data.set("anokoro:draft", "");
    expect(loadDraft(access)).toBeUndefined();
    data.set("anokoro:draft", "<html>");
    expect(loadDraft(access)).toBe("<html>");
  });

  it("ストレージが使えなくても例外を投げない", () => {
    expect(loadDraft(broken)).toBeUndefined();
    const store = createKitStore();
    persistDraft(store, broken);
    expect(() => store.getState().replace("x")).not.toThrow();
  });
});
