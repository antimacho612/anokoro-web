import { featureStatus, inRange, siteKindYears, type Year } from "@anokoro/era-data";
import type { QuizPage, QuizTrick } from "./types.ts";

function usable(trick: QuizTrick, year: Year): boolean {
  return (trick.requires ?? []).every((f) => {
    const status = featureStatus(f, year);
    return status === "available" || status === "outdated";
  });
}

/**
 * その年に出題できる仕掛けか。
 * まだ使えない年（一部のブラウザが先に対応した年は除く）で、前提の機能は使える年に限る。
 */
export function trickAvailableIn(trick: QuizTrick, year: Year): boolean {
  return featureStatus(trick.feature, year) === "future" && usable(trick, year);
}

/** 表示モードで出題できる仕掛けか。見た目が変わるもの */
export function trickDisplayable(trick: QuizTrick): boolean {
  return trick.visible;
}

/** その年に出題できるお題か。お題の年の範囲と、サイトの種類がある年の両方に入るもの */
export function pageAvailableIn(page: QuizPage, year: Year): boolean {
  return inRange(year, page.years) && inRange(year, siteKindYears(page.kind));
}
