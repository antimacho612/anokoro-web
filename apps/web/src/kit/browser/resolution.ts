import { resolutionPeriodForYear, type Resolution, type Year } from "@anokoro/era-data";

/** 年を変えたあとの解像度。解像度の期が変わったら、その期の既定値に戻す */
export function resolutionAfterYearChange(
  prevYear: Year,
  nextYear: Year,
  current: Resolution,
): Resolution {
  const next = resolutionPeriodForYear(nextYear);
  return next === resolutionPeriodForYear(prevYear) ? current : next.default;
}

export function resolutionValue({ width, height }: Resolution): string {
  return `${width}x${height}`;
}

/** `800x600` の形の値を、その年の候補から探す */
export function findResolution(year: Year, value: string): Resolution | undefined {
  return resolutionPeriodForYear(year).candidates.find((r) => resolutionValue(r) === value);
}
