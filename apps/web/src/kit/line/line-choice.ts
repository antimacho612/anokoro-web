import { defaultLineForYear, linesForYear, type LineKey, type Year } from "@anokoro/era-data";

export function isLineSelectable(year: Year, key: LineKey): boolean {
  return linesForYear(year).some((line) => line.key === key);
}

export function lineAfterYearChange(prevYear: Year, nextYear: Year, current: LineKey): LineKey {
  const nextDefault = defaultLineForYear(nextYear).key;
  if (defaultLineForYear(prevYear).key !== nextDefault) return nextDefault;
  return isLineSelectable(nextYear, current) ? current : nextDefault;
}
