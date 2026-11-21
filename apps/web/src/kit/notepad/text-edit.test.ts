import { describe, expect, it } from "vite-plus/test";
import { byteLength, formatUsage, insertText } from "./text-edit.ts";

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
