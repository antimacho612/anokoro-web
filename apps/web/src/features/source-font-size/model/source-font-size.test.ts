import { describe, expect, test } from "vite-plus/test";
import { loadSourceFontSize, saveSourceFontSize } from "./source-font-size.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    items,
    access: () => ({
      getItem: (key: string) => items.get(key) ?? null,
      setItem: (key: string, value: string) => void items.set(key, value),
    }),
  };
}

describe("ソースの文字の大きさの保存", () => {
  test("保存がなければ中", () => {
    expect(loadSourceFontSize(memoryStorage().access)).toBe("medium");
  });

  test("保存した大きさを読み戻す", () => {
    const storage = memoryStorage();
    saveSourceFontSize(storage.access, "large");
    expect(storage.items.get("anokoro:source-font-size")).toBe("large");
    expect(loadSourceFontSize(storage.access)).toBe("large");
  });

  test("知らない値は中として扱う", () => {
    const storage = memoryStorage({ "anokoro:source-font-size": "huge" });
    expect(loadSourceFontSize(storage.access)).toBe("medium");
  });

  test("ストレージを使えなくても例外を出さない", () => {
    const broken = () => {
      throw new Error("blocked");
    };
    expect(loadSourceFontSize(broken)).toBe("medium");
    expect(() => saveSourceFontSize(broken, "small")).not.toThrow();
  });
});
