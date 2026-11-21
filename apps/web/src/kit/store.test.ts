import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "./store.ts";

describe("createKitStore", () => {
  it("既定の年は 1995 年", () => {
    expect(createKitStore().getState().year).toBe(1995);
  });

  it("年を 1995 〜 2015 年の範囲に収める", () => {
    const store = createKitStore({ year: 2003 });
    store.getState().setYear(1990);
    expect(store.getState().year).toBe(1995);
    store.getState().setYear(2020);
    expect(store.getState().year).toBe(2015);
  });

  it("前後の年へ 1 年ずつ動かし、端では止まる", () => {
    const store = createKitStore({ year: 2014 });
    store.getState().stepYear(1);
    expect(store.getState().year).toBe(2015);
    store.getState().stepYear(1);
    expect(store.getState().year).toBe(2015);
    store.getState().stepYear(-1);
    expect(store.getState().year).toBe(2014);
  });
});

describe("メモ帳とローカル表示", () => {
  it("入力しただけでは表示を更新せず、show で追いつく", () => {
    const store = createKitStore({ source: "a" });
    store.getState().edit("ab");
    expect(store.getState()).toMatchObject({
      source: "ab",
      shownSource: "a",
      status: "読み込み中...",
    });
    store.getState().show();
    expect(store.getState()).toMatchObject({
      shownSource: "ab",
      status: "ローカルのファイルを表示しています",
    });
  });

  it("replace はすぐに表示まで差し替える", () => {
    const store = createKitStore({ source: "a" });
    store.getState().replace("b");
    expect(store.getState()).toMatchObject({ source: "b", shownSource: "b" });
  });
});

describe("解像度", () => {
  it("初期値はその年の既定値", () => {
    expect(createKitStore({ year: 2003 }).getState().resolution).toEqual({
      width: 800,
      height: 600,
    });
  });

  it("年の期が変わると既定値に戻り、同じ期なら保つ", () => {
    const store = createKitStore({ year: 2003 });
    store.getState().setResolution({ width: 1024, height: 768 });
    store.getState().setYear(2001);
    expect(store.getState().resolution).toEqual({ width: 1024, height: 768 });
    store.getState().setYear(1998);
    expect(store.getState().resolution).toEqual({ width: 640, height: 480 });
  });
});
