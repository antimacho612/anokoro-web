import { describe, expect, test } from "vite-plus/test";
import { HelpParseError, eraLabel, parseHelpMarkdown, parseYearRange } from "./parse.ts";

const doc = (body: string, front = "id: line\ntitle: 回線事情\nyears: [1995, 2015]") =>
  `---\n${front}\n---\n\n${body}`;

describe("parseYearRange", () => {
  test.each([
    ["2003-2012", [2003, 2012]],
    ["2001-", [2001, 2015]],
    ["-2005", [1995, 2005]],
    ["2003", [2003, 2003]],
  ])("%s", (text, expected) => {
    expect(parseYearRange(text)).toEqual(expected);
  });

  test("外側の範囲で切り詰める", () => {
    expect(parseYearRange("1995-2015", [1999, 2010])).toEqual([1999, 2010]);
  });

  test.each(["", "-", "1990-2000", "2010-2005", "abc"])("読めない範囲 %j は拒否する", (text) => {
    expect(() => parseYearRange(text)).toThrow(HelpParseError);
  });
});

describe("eraLabel", () => {
  test.each([
    [[2001, 2015], "2001年ごろ〜"],
    [[1995, 2005], "〜2005年ごろ"],
    [[2003, 2012], "2003〜2012年ごろ"],
  ] as const)("%j は「ごろ」を付けて表す", (range, text) => {
    expect(eraLabel(range)).toBe(` <span data-era>${text}</span>`);
  });
});

describe("parseHelpMarkdown", () => {
  test("frontmatter と本文を読む", () => {
    const topic = parseHelpMarkdown(doc("#### 見出し\n\n本文です。`code` も書けます。\n"));
    expect(topic).toMatchObject({
      id: "line",
      title: "回線事情",
      years: [1995, 2015],
      sources: [],
    });
    expect(topic.segments).toEqual([
      {
        html: "<h4>見出し</h4>\n<p>本文です。<code>code</code> も書けます。</p>\n",
        years: [1995, 2015],
      },
    ]);
  });

  test("見出しの年の範囲は、次の同じ階層の見出しまで効く", () => {
    const topic = parseHelpMarkdown(
      doc("#### A\n\na\n\n<!-- years: 2001- -->\n#### B\n\nb\n\n- b1\n\n#### C\n\nc\n"),
    );
    expect(topic.segments).toEqual([
      { html: "<h4>A</h4>\n<p>a</p>\n", years: [1995, 2015] },
      {
        html: "<h4>B <span data-era>2001年ごろ〜</span></h4>\n<p>b</p>\n<ul>\n<li>b1</li>\n</ul>\n",
        years: [2001, 2015],
      },
      { html: "<h4>C</h4>\n<p>c</p>\n", years: [1995, 2015] },
    ]);
  });

  test("リスト項目の年の範囲は、その項目だけに効き、Markdown として読む", () => {
    const topic = parseHelpMarkdown(
      doc("- <!-- years: 2004- --> **2004** mixi 開始\n- いつでも\n"),
    );
    expect(topic.segments).toEqual([
      { html: "<ul>\n", years: [1995, 2015] },
      { html: "<li><strong>2004</strong> mixi 開始</li>\n", years: [2004, 2015] },
      { html: "<li>いつでも</li>\n</ul>\n", years: [1995, 2015] },
    ]);
  });

  test("項目の範囲は見出しの範囲の内側に収める", () => {
    const topic = parseHelpMarkdown(
      doc("<!-- years: 2004- -->\n#### A\n\n- <!-- years: -2010 --> x\n"),
    );
    expect(topic.segments.find((s) => s.html.includes("<li>"))?.years).toEqual([2004, 2010]);
  });

  test("出典は末尾に「参考」として、エスケープして出す", () => {
    const topic = parseHelpMarkdown(
      doc(
        "本文\n",
        'id: line\ntitle: 回線\nyears: [1995, 2015]\nsources:\n  - title: "A&B <記事>"\n    url: https://example.com/?a=1&b=2',
      ),
    );
    expect(topic.segments.at(-1)?.html).toBe(
      '<h4>参考</h4>\n<ul>\n<li><a href="https://example.com/?a=1&amp;b=2" target="_blank" rel="noopener noreferrer">A&amp;B &lt;記事&gt;</a></li>\n</ul>\n',
    );
  });

  test.each([
    ["frontmatter がない", "#### 見出し\n"],
    ["years が範囲外", doc("x\n", "id: line\ntitle: t\nyears: [1990, 2015]")],
    ["id がない", doc("x\n", "title: t\nyears: [1995, 2015]")],
    [
      "url が http(s) でない",
      doc(
        "x\n",
        "id: a\ntitle: t\nyears: [1995, 2015]\nsources:\n  - title: x\n    url: javascript:alert(1)",
      ),
    ],
    ["見出しでもリストでもない要素に年の範囲がある", doc("<!-- years: 2001- -->\n本文\n")],
  ])("%s場合は拒否する", (_, source) => {
    expect(() => parseHelpMarkdown(source)).toThrow(HelpParseError);
  });
});
