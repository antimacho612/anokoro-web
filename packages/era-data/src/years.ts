export type Year =
  | 1995
  | 1996
  | 1997
  | 1998
  | 1999
  | 2000
  | 2001
  | 2002
  | 2003
  | 2004
  | 2005
  | 2006
  | 2007
  | 2008
  | 2009
  | 2010
  | 2011
  | 2012
  | 2013
  | 2014
  | 2015;

export const MIN_YEAR: Year = 1995;
export const MAX_YEAR: Year = 2015;

/** 選べる年を古い順に並べたもの */
export const YEARS: readonly Year[] = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MIN_YEAR + i,
).filter(isYear);

export function isYear(value: unknown): value is Year {
  return (
    typeof value === "number" && Number.isInteger(value) && value >= MIN_YEAR && value <= MAX_YEAR
  );
}

/** 範囲外の数は近いほうの端の年に寄せ、小数は切り捨てる。NaN は MIN_YEAR */
export function clampYear(value: number): Year {
  const year = Math.min(MAX_YEAR, Math.max(MIN_YEAR, Math.trunc(value)));
  return isYear(year) ? year : MIN_YEAR;
}

/** 年の範囲 [from, to]（両端を含む） */
export type YearRange = readonly [from: Year, to: Year];

export function inRange(year: Year, [from, to]: YearRange): boolean {
  return year >= from && year <= to;
}

export interface Source {
  title: string;
  url: string;
}
