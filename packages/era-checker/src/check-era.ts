import { isYear } from "@anokoro/era-data";
import { parse, serializeOuter } from "parse5";
import { CheckContext } from "./context.ts";
import { createElement, findElement, isElement, textContent, type Element } from "./dom.ts";
import { walkRoot } from "./html.ts";
import type { CheckOptions, CheckResult, Mode, Warning } from "./types.ts";

/** キットの既定スタイル。head の先頭に入れるので、ユーザーの style が優先される */
const BASE_STYLE =
  'body{font-family:"MS PGothic","ＭＳ Ｐゴシック","Osaka","Hiragino Kaku Gothic ProN",sans-serif;font-size:16px;margin:8px;line-height:1.25}' +
  "blink{animation:__b 1s steps(1) infinite}@keyframes __b{50%{visibility:hidden}}" +
  "@media (prefers-reduced-motion:reduce){blink{animation:none}}" +
  '.__ctr{font-family:"Courier New",monospace;background:#000;color:#3f3;padding:1px 4px;letter-spacing:2px;font-weight:bold;border:2px inset #666}' +
  ".__plugin{display:inline-block;border:1px solid #999;background:#eee;color:#555;font-size:12px;padding:10px;margin:2px}";

const NET_STYLE = "img[data-anokoro-img]{outline:1px solid #aaa;outline-offset:-1px}";

const MODES: readonly Mode[] = ["local", "net", "publish"];

/** 再現度。重複を除いた警告 1 種類ごとに future は 8 点、note は 3 点を引く */
export function scoreOf(warnings: readonly Warning[]): number {
  const penalty = warnings.reduce((sum, w) => sum + (w.level === "future" ? 8 : 3), 0);
  return Math.max(0, 100 - penalty);
}

function counterDigits(counter: number | undefined): string {
  const n =
    counter !== undefined && Number.isFinite(counter) ? Math.max(0, Math.trunc(counter)) : 0;
  return String(n).padStart(6, "0");
}

/**
 * ページの HTML を選んだ年のブラウザらしく表示できる形にし、同時に無害化する。
 * 同じ入力とオプションなら同じ結果を返す純粋関数。
 */
export function checkEra(source: string, opts: CheckOptions): CheckResult {
  if (!isYear(opts.year)) throw new RangeError(`対象外の年です: ${String(opts.year)}`);
  if (!MODES.includes(opts.mode)) throw new RangeError(`未知のモードです: ${String(opts.mode)}`);

  const ctx = new CheckContext(source, opts.year, opts.mode);
  const doc = parse(source, { sourceCodeLocationInfo: true, scriptingEnabled: false });
  const root = doc.childNodes.find((n): n is Element => isElement(n) && n.tagName === "html");
  if (!root) throw new Error("html 要素がありません");

  walkRoot(ctx, root, counterDigits(opts.counter));

  const head = findElement(root, "head");
  if (head) {
    const style = createElement("style", {}, BASE_STYLE + (opts.mode === "net" ? NET_STYLE : ""));
    style.parentNode = head;
    head.childNodes.unshift(style);
  }

  const titleEl = findElement(root, "title");
  const title = titleEl
    ? textContent(titleEl)
        .replace(/[\t\n\f\r ]+/g, " ")
        .trim()
    : "";
  const warnings = ctx.warnings();
  return {
    html: `<!DOCTYPE html>${serializeOuter(root)}`,
    warnings,
    score: scoreOf(warnings),
    title,
    assets: ctx.assets,
  };
}
