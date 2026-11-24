import { MAX_YEAR, clampYear, uiThemeForYear, type UiThemeId } from "@anokoro/era-data";

export type Rgb = readonly [number, number, number];

export interface EraPalette {
  glow: Rgb;
  frame: Rgb;
  title: Rgb;
  text: Rgb;
  rounded: boolean;
}

const PRESENT: EraPalette = {
  glow: [150, 170, 205],
  frame: [96, 108, 130],
  title: [52, 62, 84],
  text: [214, 224, 240],
  rounded: false,
};

export const THEMES: Record<UiThemeId, EraPalette> = {
  "gray-bevel": {
    glow: [0, 190, 190],
    frame: [192, 192, 192],
    title: [0, 0, 128],
    text: [220, 255, 250],
    rounded: false,
  },
  "gray-gradient": {
    glow: [40, 150, 230],
    frame: [192, 192, 192],
    title: [16, 132, 208],
    text: [215, 240, 255],
    rounded: false,
  },
  "blue-round": {
    glow: [70, 140, 255],
    frame: [236, 233, 216],
    title: [0, 83, 238],
    text: [225, 235, 255],
    rounded: true,
  },
  glass: {
    glow: [110, 190, 230],
    frame: [170, 198, 226],
    title: [47, 106, 143],
    text: [230, 245, 255],
    rounded: true,
  },
  "flat-bold": {
    glow: [60, 130, 230],
    frame: [106, 159, 216],
    title: [29, 78, 137],
    text: [225, 238, 255],
    rounded: false,
  },
  "flat-thin": {
    glow: [0, 140, 255],
    frame: [0, 120, 215],
    title: [12, 79, 138],
    text: [230, 244, 255],
    rounded: false,
  },
};

export interface CssColorRef {
  prop: `--${string}`;
  stop?: number;
}

export const THEME_CSS_ORIGIN: Record<UiThemeId, { frame: CssColorRef; title: CssColorRef }> = {
  "gray-bevel": { frame: { prop: "--face" }, title: { prop: "--title-bg" } },
  "gray-gradient": { frame: { prop: "--face" }, title: { prop: "--title-bg", stop: 1 } },
  "blue-round": { frame: { prop: "--face" }, title: { prop: "--title-bg", stop: 1 } },
  glass: { frame: { prop: "--win-bg", stop: 2 }, title: { prop: "--desktop-bg" } },
  "flat-bold": { frame: { prop: "--win-bg" }, title: { prop: "--desktop-bg" } },
  "flat-thin": { frame: { prop: "--win-border-color" }, title: { prop: "--desktop-bg", stop: 1 } },
};

function paletteOfYear(year: number): EraPalette {
  if (year > MAX_YEAR) return PRESENT;
  return THEMES[uiThemeForYear(clampYear(year)).id];
}

function mix(a: Rgb, b: Rgb, t: number): Rgb {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

export function eraPalette(yearValue: number): EraPalette {
  const lower = Math.floor(yearValue);
  const t = yearValue - lower;
  const a = paletteOfYear(lower);
  const b = paletteOfYear(lower + 1);
  if (a === b) return a;
  return {
    glow: mix(a.glow, b.glow, t),
    frame: mix(a.frame, b.frame, t),
    title: mix(a.title, b.title, t),
    text: mix(a.text, b.text, t),
    rounded: t < 0.5 ? a.rounded : b.rounded,
  };
}

export function rgba([r, g, b]: Rgb, alpha: number): string {
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}
