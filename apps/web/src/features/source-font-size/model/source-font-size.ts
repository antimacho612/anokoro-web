import { useState } from "react";
import type { StorageAccess } from "../../../shared/lib/index.ts";

export const SOURCE_FONT_SIZES = ["small", "medium", "large"] as const;
export type SourceFontSize = (typeof SOURCE_FONT_SIZES)[number];

export const SOURCE_FONT_SIZE_LABELS: Readonly<Record<SourceFontSize, string>> = {
  small: "小",
  medium: "中",
  large: "大",
};

export const SOURCE_FONT_PX: Readonly<Record<SourceFontSize, number>> = {
  small: 11,
  medium: 13,
  large: 16,
};

const SOURCE_FONT_SIZE_KEY = "anokoro:source-font-size";
const DEFAULT_SIZE: SourceFontSize = "medium";

function isSourceFontSize(value: string | null): value is SourceFontSize {
  return SOURCE_FONT_SIZES.some((size) => size === value);
}

export function loadSourceFontSize(storage: StorageAccess): SourceFontSize {
  try {
    const value = storage().getItem(SOURCE_FONT_SIZE_KEY);
    return isSourceFontSize(value) ? value : DEFAULT_SIZE;
  } catch {
    return DEFAULT_SIZE;
  }
}

export function saveSourceFontSize(storage: StorageAccess, size: SourceFontSize): void {
  try {
    storage().setItem(SOURCE_FONT_SIZE_KEY, size);
  } catch {}
}

const browserStorage: StorageAccess = () => window.localStorage;

/** ソースを表示する欄の文字の大きさ。作成キットのメモ帳と時代まちがいさがしで共有する */
export function useSourceFontSize(): [SourceFontSize, (size: SourceFontSize) => void] {
  const [size, setSize] = useState(() => loadSourceFontSize(browserStorage));
  const change = (next: SourceFontSize): void => {
    setSize(next);
    saveSourceFontSize(browserStorage, next);
  };
  return [size, change];
}
