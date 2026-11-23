import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "../store.ts";
import { persistNetSettings, restoreNetSettings, restoreSound, saveLine } from "./net-settings.ts";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  const storage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
  return { data, access: () => storage };
}

describe("restoreNetSettings", () => {
  it("保存した回線、接続音、M1 で保存したローカルカウンターを読み込む", () => {
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

describe("restoreSound", () => {
  it("閲覧画面では回線をサイトの年の既定にするため、接続音だけを戻す", () => {
    const store = createKitStore({ year: 2003 });
    const { access } = memoryStorage({
      "anokoro:line": "isdn",
      "anokoro:sound": "off",
      "anokoro:counter": "998",
    });
    restoreSound(store, access);
    expect(store.getState()).toMatchObject({ lineKey: "adsl12", sound: false, counter: 774 });
  });
});

describe("保存", () => {
  it("回線と接続音を anokoro: のキーで保存する。カウンターはサイトに保存するので書かない", () => {
    const store = createKitStore({ year: 2003 });
    const { data, access } = memoryStorage();
    persistNetSettings(store, access);
    saveLine(access, "isdn");
    store.getState().setSound(false);
    store.setState({ counter: 775 });
    expect(Object.fromEntries(data)).toEqual({
      "anokoro:line": "isdn",
      "anokoro:sound": "off",
    });
  });
});
