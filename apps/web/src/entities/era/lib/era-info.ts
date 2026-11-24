import {
  defaultLineForYear,
  formatResolution,
  resolutionPeriodForYear,
  uiThemeForYear,
  type UiThemeId,
  type Year,
} from "@anokoro/era-data";

const THEME_LABELS: Record<UiThemeId, string> = {
  "gray-bevel": "灰色の立体",
  "gray-gradient": "グラデーションのタイトルバー",
  "blue-round": "青い丸み",
  glass: "すりガラス",
  "flat-bold": "太い枠の平面",
  "flat-thin": "細い枠の平面",
};

export function themeLabel(year: Year): string {
  return THEME_LABELS[uiThemeForYear(year).id];
}

export interface EnvironmentItem {
  label: string;
  value: string;
}

export function environmentItems(year: Year): EnvironmentItem[] {
  return [
    { label: "回線", value: defaultLineForYear(year).name },
    { label: "画面", value: formatResolution(resolutionPeriodForYear(year).default) },
    { label: "外観", value: themeLabel(year) },
  ];
}
