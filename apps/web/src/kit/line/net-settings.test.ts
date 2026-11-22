import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "../store.ts";
import { persistNetSettings, restoreNetSettings, saveLine } from "./net-settings.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
  return { data, access: () => storage };
}

describe("restoreNetSettings", () => {
  it("保存した回線、接続音、カウンターを読み込む", () => {
    const store = createKitStore({ year: 2003 });
    const { access } = memoryStorage({
      "anokoro:line": "isdn",
      "anokoro:sound": "off",
      "anokoro:counter": "998",
    });
    restoreNetSettings(store, access);
    expect(store.getState()).toMatchObject({ lineKey: "isdn", sound: false, counter: 998 });
  });

  it("その年に選べない回線や壊れた値は無視する", () => {
    const store = createKitStore({ year: 1996 });
    const { access } = memoryStorage({
      "anokoro:line": "hikari",
      "anokoro:sound": "maybe",
      "anokoro:counter": "-3",
    });
    restoreNetSettings(store, access);
    expect(store.getState()).toMatchObject({ lineKey: "m28", sound: true, counter: 774 });
  });

  it("ストレージが例外を投げても既定値のまま続ける", () => {
    const store = createKitStore({ year: 2003 });
    restoreNetSettings(store, () => {
      throw new Error("denied");
    });
    expect(store.getState().lineKey).toBe("adsl12");
  });
});

describe("保存", () => {
  it("回線、接続音、カウンターを anokoro: のキーで保存する", () => {
    const store = createKitStore({ year: 2003 });
    const { data, access } = memoryStorage();
    persistNetSettings(store, access);
    saveLine(access, "isdn");
    store.getState().setSound(false);
    store.setState({ counter: 775 });
    expect(Object.fromEntries(data)).toEqual({
      "anokoro:line": "isdn",
      "anokoro:sound": "off",
      "anokoro:counter": "775",
    });
  });
});
