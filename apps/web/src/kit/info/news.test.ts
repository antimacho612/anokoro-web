import { expect, test } from "vite-plus/test";
import { NEWS } from "./news.ts";

test("日付は YYYY-MM-DD の実在する日", () => {
  for (const { date } of NEWS) {
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10)).toBe(date);
  }
});

test("新しい順に並ぶ", () => {
  const dates = NEWS.map((entry) => entry.date);
  expect(dates).toEqual(dates.toSorted().toReversed());
});
