import { readFileSync } from "node:fs";
import type { Year } from "@anokoro/era-data";
import { ASSETS, BROKEN_IMAGE, PENDING_IMAGE, toDataUri } from "@anokoro/assets";
import { describe, expect, it } from "vite-plus/test";
import { checkEra, type CheckResult, type Mode } from "../src/index.ts";

const YEARS = [1996, 2003, 2008, 2012, 2015] as const;
const CASES = ["template", "modern", "parts", "era-features"] as const;

const DATA_URI_LABELS: readonly (readonly [string, string])[] = [
  ...ASSETS.map((a) => [toDataUri(a.svg), `[asset:${a.name}]`] as const),
  [toDataUri(BROKEN_IMAGE.svg), "[asset:broken]"],
  [toDataUri(PENDING_IMAGE.svg), "[asset:pending]"],
];

function readable(text: string): string {
  return DATA_URI_LABELS.reduce((s, [uri, label]) => s.replaceAll(uri, label), text);
}

function oneTagPerLine(html: string): string {
  return `${readable(html).replace(/></g, ">\n<")}\n`;
}

function formatResult({ html: _html, ...rest }: CheckResult): string {
  return `${readable(JSON.stringify(rest, null, 2))}\n`;
}

const input = (name: string): string =>
  readFileSync(new URL(`./golden/cases/${name}.html`, import.meta.url), "utf8");

async function expectGolden(name: string, mode: Mode, year: Year): Promise<void> {
  const result = checkEra(input(name), { year, mode, counter: 774 });
  const base = `./golden/expected/${name}/${mode}-${year}`;
  await expect(oneTagPerLine(result.html)).toMatchFileSnapshot(`${base}.html`);
  await expect(formatResult(result)).toMatchFileSnapshot(`${base}.json`);
}

describe.each(CASES)("%s", (name) => {
  it.each(YEARS)("local %i 年", async (year) => {
    await expectGolden(name, "local", year);
  });
});

describe("template の回線経由表示と公開", () => {
  it.each(["net", "publish"] as const)("%s 2003 年", async (mode) => {
    await expectGolden("template", mode, 2003);
  });
});

describe("年ごとの違い", () => {
  const score = (name: string, year: Year): number =>
    checkEra(input(name), { year, mode: "local" }).score;

  it("テンプレートは 2003 年に警告がなく、2008 年からは古い書き方の注意が出る", () => {
    expect(checkEra(input("template"), { year: 2003, mode: "local" }).warnings).toEqual([]);
    expect(score("template", 2003)).toBe(100);
    expect(score("template", 2008)).toBeLessThan(100);
  });

  it("違反例は CSS が普及してからは、年が進むほど再現度が上がる", () => {
    const scores = ([2003, 2008, 2012, 2015] as const).map((year) => score("modern", year));
    expect(scores).toEqual([...scores].sort((a, b) => a - b));
    expect(scores[0]).toBeLessThan(scores.at(-1) ?? 0);
  });

  it("同じ入力なら同じ結果を返す", () => {
    const a = checkEra(input("era-features"), { year: 2008, mode: "net", counter: 1 });
    const b = checkEra(input("era-features"), { year: 2008, mode: "net", counter: 1 });
    expect(a).toEqual(b);
  });
});
