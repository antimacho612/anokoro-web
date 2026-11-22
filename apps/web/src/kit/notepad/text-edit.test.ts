import { describe, expect, it } from "vite-plus/test";
import { byteLength, formatUsage, insertText, offsetOf } from "./text-edit.ts";

describe("insertText", () => {
  it("カーソル位置に挿入し、カーソルを挿入した文字の後ろに置く", () => {
    expect(insertText("abcd", 2, 2, "XY")).toEqual({ value: "abXYcd", caret: 4 });
  });

  it("選択範囲を置き換える", () => {
    expect(insertText("abcd", 1, 3, "\t")).toEqual({ value: "a\td", caret: 2 });
  });

  it("逆向きの選択や範囲外の位置でも壊れない", () => {
    expect(insertText("abcd", 3, 1, "-")).toEqual({ value: "a-d", caret: 2 });
    expect(insertText("ab", 10, 10, "c")).toEqual({ value: "abc", caret: 3 });
  });
});

describe("容量の表示", () => {
  it("UTF-8 のバイト数で数える", () => {
    expect(byteLength("abc")).toBe(3);
    expect(byteLength("あ")).toBe(3);
  });

  it("KB を小数 1 桁で表示する", () => {
    expect(formatUsage(0)).toBe("使用容量 0.0KB / 50MB");
    expect(formatUsage(1536)).toBe("使用容量 1.5KB / 50MB");
  });
});

describe("offsetOf", () => {
  const text = "ab\ncde\n\nf";

  it("1 始まりの行と桁を位置に直す", () => {
    expect(offsetOf(text, 1, 1)).toBe(0);
    expect(offsetOf(text, 2, 2)).toBe(4);
    expect(offsetOf(text, 4, 1)).toBe(8);
  });

  it("行より長い桁は行末に、ない行は末尾に寄せる", () => {
    expect(offsetOf(text, 2, 99)).toBe(6);
    expect(offsetOf(text, 3, 5)).toBe(7);
    expect(offsetOf(text, 9, 1)).toBe(text.length);
  });

  it("0 以下の行や桁は先頭に寄せる", () => {
    expect(offsetOf(text, 0, 0)).toBe(0);
    expect(offsetOf(text, 2, -3)).toBe(3);
  });
});
