import { describe, expect, test } from "vite-plus/test";
import { placeBubble } from "./bubble-placement.ts";

const viewport = { width: 1280, height: 800 };
const bubble = { width: 340, height: 200 };
const gap = 12;

describe("placeBubble", () => {
  test("右に余白があれば、対象の右に置く", () => {
    const target = { top: 100, left: 10, width: 500, height: 900 };
    expect(placeBubble({ target, bubble, viewport, gap })).toEqual({
      kind: "floating",
      top: 100,
      left: 522,
    });
  });

  test("右に収まらなければ左に置く", () => {
    const target = { top: 100, left: 560, width: 700, height: 600 };
    expect(placeBubble({ target, bubble, viewport, gap })).toEqual({
      kind: "floating",
      top: 100,
      left: 208,
    });
  });

  test("横に収まらなければ下に置き、横は画面の中に収める", () => {
    const target = { top: 50, left: 10, width: 1260, height: 40 };
    expect(placeBubble({ target, bubble, viewport, gap })).toEqual({
      kind: "floating",
      top: 102,
      left: 12,
    });
  });

  test("下に収まらなければ上に置く", () => {
    const target = { top: 700, left: 10, width: 1260, height: 80 };
    expect(placeBubble({ target, bubble, viewport, gap })).toEqual({
      kind: "floating",
      top: 488,
      left: 12,
    });
  });

  test("対象が画面の上にはみ出していても、吹き出しは画面の中に収める", () => {
    const target = { top: -300, left: 10, width: 500, height: 900 };
    expect(placeBubble({ target, bubble, viewport, gap })).toMatchObject({ top: 12 });
  });

  test("どこにも収まらなければ、画面の下端に置く", () => {
    const target = { top: 0, left: 0, width: 1280, height: 800 };
    expect(placeBubble({ target, bubble, viewport, gap })).toEqual({ kind: "docked" });
  });
});
