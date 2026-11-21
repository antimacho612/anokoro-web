/** 選べる年。1995 〜 2015 年 */
export type Year = number;

export const MIN_YEAR: Year = 1995;
export const MAX_YEAR: Year = 2015;

/** 選べる年を古い順に並べたもの */
export const YEARS: readonly Year[] = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MIN_YEAR + i,
);

export function isYear(value: unknown): value is Year {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= MIN_YEAR && value <= MAX_YEAR
  );
}

/** 年の範囲 [from, to]（両端を含む） */
export type YearRange = readonly [from: Year, to: Year];

export function inRange(year: Year, [from, to]: YearRange): boolean {
  return year >= from && year <= to;
}

/** 根拠の出典 */
export interface Source {
  title: string;
  url: string;
}
