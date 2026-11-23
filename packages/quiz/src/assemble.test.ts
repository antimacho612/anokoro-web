import { describe, expect, it } from "vite-plus/test";
import { ANSWER_ATTRIBUTE, assembleQuiz, listSlots, slotsFor } from "./assemble.ts";
import { pageAvailableIn, trickAvailableIn, trickDisplayable } from "./eligibility.ts";
import type { QuizPage, QuizTrick } from "./types.ts";

const page: QuizPage = {
  id: "test-1997",
  kind: "personal",
  years: [1997, 2002],
  url: "http://www.hogespace.example/",
  source: [
    "<html><body>",
    "<p{{quiz:style}}>あいさつ</p>",
    "{{quiz:block}}",
    "<p>本文{{quiz:inline}}です</p>",
    '<a{{quiz:attr:a}} href="a.html">リンク</a>',
    "</body></html>",
  ].join("\n"),
};

const radius: QuizTrick = {
  id: "border-radius",
  ruleId: "css.border-radius",
  topic: "css",
  feature: "css.border-radius",
  requires: ["css.basic"],
  insert: { kind: "style", declarations: "border-radius:10px" },
  visible: true,
};

const section: QuizTrick = {
  id: "section",
  ruleId: "html.element.section",
  topic: "html",
  feature: "html5.semantic",
  insert: { kind: "element", slot: "block", html: "<section>お知らせ</section>" },
  visible: false,
};

const dataAttr: QuizTrick = {
  id: "data",
  ruleId: "html.attr.html5",
  topic: "html",
  feature: "html5.global-attributes",
  insert: { kind: "attribute", tag: "a", name: "data-x", value: 'a"b' },
  visible: false,
};

describe("差し込み口", () => {
  it("ソースの順に種類を並べる", () => {
    expect(listSlots(page).map((s) => s.kind)).toEqual(["style", "block", "inline", "attr:a"]);
  });

  it("仕掛けに合う差し込み口だけを返す", () => {
    expect(slotsFor(page, radius).map((s) => s.index)).toEqual([0]);
    expect(slotsFor(page, section).map((s) => s.index)).toEqual([1]);
  });
});

describe("assembleQuiz", () => {
  it("仕掛けなしでは目印を消し、目印だけの行は行ごと消す", () => {
    expect(assembleQuiz(page)).toEqual({
      source: [
        "<html><body>",
        "<p>あいさつ</p>",
        "<p>本文です</p>",
        '<a href="a.html">リンク</a>',
        "</body></html>",
      ].join("\n"),
      answerLine: null,
    });
  });

  it("style の仕掛けは style 属性として入れる", () => {
    const { source, answerLine } = assembleQuiz(page, { trick: radius, slot: 0 });
    expect(source.split("\n")[1]).toBe('<p style="border-radius:10px">あいさつ</p>');
    expect(answerLine).toBe(2);
  });

  it("ブロックの仕掛けは目印の行に入れ、行番号を返す", () => {
    const { source, answerLine } = assembleQuiz(page, { trick: section, slot: 1 });
    expect(source.split("\n")[2]).toBe("<section>お知らせ</section>");
    expect(answerLine).toBe(3);
  });

  it("属性の値は引用符をエスケープする", () => {
    const { source, answerLine } = assembleQuiz(page, { trick: dataAttr, slot: 3 });
    expect(source).toContain('<a data-x="a&quot;b" href="a.html">');
    expect(answerLine).toBe(4);
  });

  it("markAnswer では仕掛けを入れたタグに答えの目印を付ける", () => {
    const mark = { markAnswer: true };
    const lineOf = (source: string, index: number): string | undefined => source.split("\n")[index];
    expect(lineOf(assembleQuiz(page, { trick: radius, slot: 0 }, mark).source, 1)).toBe(
      `<p ${ANSWER_ATTRIBUTE} style="border-radius:10px">あいさつ</p>`,
    );
    expect(lineOf(assembleQuiz(page, { trick: section, slot: 1 }, mark).source, 2)).toBe(
      `<section ${ANSWER_ATTRIBUTE}>お知らせ</section>`,
    );
    expect(assembleQuiz(page, { trick: dataAttr, slot: 3 }, mark).source).toContain(
      `<a ${ANSWER_ATTRIBUTE} data-x=`,
    );
  });

  it("合わない差し込み口を指定するとエラー", () => {
    expect(() => assembleQuiz(page, { trick: radius, slot: 1 })).toThrow(RangeError);
    expect(() => assembleQuiz(page, { trick: radius, slot: 9 })).toThrow(RangeError);
  });
});

describe("出題できる年", () => {
  it("まだ使えない年だけ。一部のブラウザが先に対応した年は除く", () => {
    expect(trickAvailableIn(radius, 2007)).toBe(true);
    expect(trickAvailableIn(radius, 2008)).toBe(false);
    expect(trickAvailableIn(radius, 2011)).toBe(false);
  });

  it("前提の機能がまだ使えない年は出さない", () => {
    expect(trickAvailableIn(radius, 1996)).toBe(false);
    expect(trickAvailableIn(radius, 1997)).toBe(true);
  });

  it("availableFrom が null の機能は、どの年でも出せる", () => {
    expect(trickAvailableIn(dataAttr, 1995)).toBe(true);
    expect(trickAvailableIn(dataAttr, 2015)).toBe(true);
  });

  it("表示モードで出せるのは、見た目が変わるもの", () => {
    expect(trickDisplayable(radius)).toBe(true);
    expect(trickDisplayable(section)).toBe(false);
    expect(trickDisplayable({ ...dataAttr, visible: true })).toBe(true);
  });
});

describe("お題を出せる年", () => {
  it("お題の範囲とサイトの種類の年の両方に入る年だけ", () => {
    const blog: QuizPage = { ...page, kind: "blog", years: [2000, 2005] };
    expect(pageAvailableIn(blog, 2002)).toBe(false);
    expect(pageAvailableIn(blog, 2003)).toBe(true);
    expect(pageAvailableIn(blog, 2006)).toBe(false);
  });
});
