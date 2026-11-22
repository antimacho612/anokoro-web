import { describe, expect, test } from "vite-plus/test";
import { BOOTED_KEY, hasBooted, markBooted } from "./boot-session.ts";
import { createBootStore } from "./boot-store.ts";

describe("bootStore", () => {
  test("電源ボタンの画面を開き、押すと演出を始め、閉じると消す", () => {
    const store = createBootStore();
    expect(store.getState().mode).toBe("hidden");
    store.getState().open();
    expect(store.getState().mode).toBe("awaitingPower");
    store.getState().start();
    expect(store.getState().mode).toBe("running");
    store.getState().close();
    expect(store.getState().mode).toBe("hidden");
  });

  test("演出中に開き直しても、最初からやり直さない", () => {
    const store = createBootStore();
    store.getState().open();
    store.getState().start();
    store.getState().open();
    expect(store.getState().mode).toBe("running");
  });

  test("電源ボタンの画面を出していないときは始めない", () => {
    const store = createBootStore();
    store.getState().start();
    expect(store.getState().mode).toBe("hidden");
  });
});

describe("起動済みの記録", () => {
  const memory = (initial: Record<string, string> = {}) => {
    const data = new Map(Object.entries(initial));
    return {
      data,
      access: () => ({
        getItem: (key: string) => data.get(key) ?? null,
        setItem: (key: string, value: string) => void data.set(key, value),
      }),
    };
  };

  test("anokoro: のキーに記録し、読み出す", () => {
    const storage = memory();
    expect(hasBooted(storage.access)).toBe(false);
    markBooted(storage.access);
    expect(storage.data.get(BOOTED_KEY)).toBe("1");
    expect(BOOTED_KEY.startsWith("anokoro:")).toBe(true);
    expect(hasBooted(storage.access)).toBe(true);
  });

  test("ストレージが使えなければ、まだ見ていないとみなし、記録はあきらめる", () => {
    const broken = () => {
      throw new Error("SecurityError");
    };
    expect(hasBooted(broken)).toBe(false);
    expect(() => markBooted(broken)).not.toThrow();
  });
});
