import { expect, test } from "vite-plus/test";
import {
  KEYBOARD_DEPTH,
  KEYBOARD_WIDTH,
  KEYS,
  MAIN_BLOCK_WIDTH,
  keyParts,
} from "./keyboard-layout.ts";

const PARTS = KEYS.flatMap((key) => keyParts(key).map((part) => ({ key, part })));

test("文字キーの段は、どの段も同じ幅にそろう", () => {
  const rowWidths = new Map<number, number>();
  for (const { part } of PARTS.filter(({ part }) => part.y >= 1 && part.x < MAIN_BLOCK_WIDTH)) {
    rowWidths.set(part.y, (rowWidths.get(part.y) ?? 0) + part.w);
  }
  expect(rowWidths.size).toBe(5);
  for (const width of rowWidths.values()) {
    expect(width).toBeCloseTo(MAIN_BLOCK_WIDTH);
  }
});

test("Enter は 2 段にまたがり、下の段は左が欠ける", () => {
  const enter = KEYS.find((k) => k.label === "Enter" && k.x < MAIN_BLOCK_WIDTH);
  expect(enter && keyParts(enter)).toEqual([
    { x: 13.5, y: 2.15, w: 1.5, h: 1 },
    { x: 13.75, y: 3.15, w: 1.25, h: 1 },
  ]);
});

test("キーは重ならず、キーボードの中に収まる", () => {
  for (const [i, { key: keyA, part: a }] of PARTS.entries()) {
    expect(a.x + a.w).toBeLessThanOrEqual(KEYBOARD_WIDTH);
    expect(a.y + a.h).toBeLessThanOrEqual(KEYBOARD_DEPTH);
    for (const { key: keyB, part: b } of PARTS.slice(i + 1)) {
      if (keyA === keyB) continue;
      const overlaps = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
      expect(overlaps, `${keyA.label} と ${keyB.label}`).toBe(false);
    }
  }
});

test("英字キーには、かなの刻印がある", () => {
  const letters = KEYS.filter((k) => /^[A-Z]$/.test(k.label));
  expect(letters).toHaveLength(26);
  expect(letters.every((k) => k.kana !== undefined)).toBe(true);
  expect(KEYS.find((k) => k.label === "A")?.kana).toBe("ち");
});
