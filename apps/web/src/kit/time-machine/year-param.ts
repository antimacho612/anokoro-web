import { MIN_YEAR, isYear, type Year } from "@anokoro/era-data";

export const DEFAULT_YEAR: Year = MIN_YEAR;

const YEAR_PARAM = "year";

export function readYearParam(search: string): Year {
  const raw = new URLSearchParams(search).get(YEAR_PARAM);
  if (raw === null || !/^\d{4}$/.test(raw)) return DEFAULT_YEAR;
  const year = Number(raw);
  return isYear(year) ? year : DEFAULT_YEAR;
}

export function withYearParam(href: string, year: Year): string {
  const url = new URL(href);
  url.searchParams.set(YEAR_PARAM, String(year));
  return url.href;
}
