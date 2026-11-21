import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "./store.ts";

describe("createKitStore", () => {
  it("既定の年は 1995 年", () => {
    expect(createKitStore().getState().year).toBe(1995);
  });

  it("年を 1995 〜 2015 年の範囲に収める", () => {
    const store = createKitStore(2003);
    store.getState().setYear(1990);
    expect(store.getState().year).toBe(1995);
    store.getState().setYear(2020);
    expect(store.getState().year).toBe(2015);
  });

  it("前後の年へ 1 年ずつ動かし、端では止まる", () => {
    const store = createKitStore(2014);
    store.getState().stepYear(1);
    expect(store.getState().year).toBe(2015);
    store.getState().stepYear(1);
    expect(store.getState().year).toBe(2015);
    store.getState().stepYear(-1);
    expect(store.getState().year).toBe(2014);
  });
});
