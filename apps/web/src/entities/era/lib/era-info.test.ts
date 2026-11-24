import { YEARS } from "@anokoro/era-data";
import { expect, test } from "vite-plus/test";
import { environmentItems } from "./era-info.ts";

test("その年の既定の回線と画面の大きさと外観を出す", () => {
  expect(environmentItems(1996)).toEqual([
    { label: "回線", value: "28.8kモデム" },
    { label: "画面", value: "640×480" },
    { label: "外観", value: "灰色の立体" },
  ]);
});

test.each(YEARS)("%i 年にも 3 つそろう", (year) => {
  expect(environmentItems(year).every((item) => item.value.length > 0)).toBe(true);
});
