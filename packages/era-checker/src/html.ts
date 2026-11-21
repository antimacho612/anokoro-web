import { FAKE_BYTES, PENDING_IMAGE, toDataUri } from "@anokoro/assets";
import { featureStatus } from "@anokoro/era-data";
import type { DefaultTreeAdapterTypes as T } from "parse5";
import { SCHEME_MESSAGE, type CheckContext } from "./context.ts";
import { filterStyleAttribute, filterStyleSheet } from "./css.ts";
import {
  childrenOf,
  createElement,
  getAttr,
  isElement,
  removeAttr,
  setAttr,
  setText,
  textContent,
  type ChildNode,
  type Element,
  type ParentNode,
} from "./dom.ts";
import {
  BASIC_TAGS,
  DROPPED_URL_ATTRS,
  EMBED_TAGS,
  FORM_DROPPED_ATTRS,
  FRAME_TAGS,
  HTML5_INPUT_TYPES,
  HTML5_TAGS,
  KIT_ATTR_PREFIX,
  MAX_DEPTH,
  MEDIA_FEATURES,
  MESSAGES,
  TABLE_TAGS,
  TAG_FEATURES,
  html5AttributeFeature,
} from "./html-rules.ts";
import type { SourceLocation } from "./types.ts";

/** 要素の処理結果。remove: 取り除く / unwrap: 中身だけ残す / keep: 残す / Element: 置き換える */
type Action = "remove" | "unwrap" | "keep" | Element;

const EXTERNAL_REL = "nofollow ugc noopener";

function elementLocation(el: Element): SourceLocation | undefined {
  const loc = el.sourceCodeLocation;
  return loc ? { line: loc.startLine, col: loc.startCol } : undefined;
}

function attrLocation(el: Element, name: string): SourceLocation | undefined {
  const loc = el.sourceCodeLocation?.attrs?.[name];
  return loc ? { line: loc.startLine, col: loc.startCol } : elementLocation(el);
}

/** 属性値が元のソースのどこから始まるか（style 属性の CSS の位置に使う） */
function attrValueLocation(ctx: CheckContext, el: Element, name: string): SourceLocation {
  const loc = el.sourceCodeLocation?.attrs?.[name];
  if (!loc) return elementLocation(el) ?? { line: 1, col: 1 };
  const raw = ctx.source.slice(loc.startOffset, loc.endOffset);
  const prefix = /^[^=]*=\s*["']?/.exec(raw)?.[0] ?? raw;
  return ctx.locationAt(loc.startOffset + prefix.length);
}

type LinkKind = "relative" | "external" | "mailto" | "blocked";

/** リンク先の種類。ブラウザと同じく、先頭の制御文字と途中のタブ・改行を無視してスキームを見る */
function linkKind(href: string): LinkKind {
  // oxlint-disable-next-line no-control-regex -- ブラウザの URL 解析に合わせて制御文字を除く
  const s = href.replace(/[\t\n\r]/g, "").replace(/^[\u0000- ]+/, "");
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(s)?.[1]?.toLowerCase();
  if (scheme === undefined) return /^[\\/]{2}/.test(s) ? "external" : "relative";
  if (scheme === "http" || scheme === "https" || scheme === "ftp") return "external";
  if (scheme === "mailto") return "mailto";
  return "blocked";
}

function pluginBox(text: string): Element {
  return createElement("span", { class: "__plugin" }, text);
}

/** 入れ子が深すぎる要素の中身を文字だけにする */
function flatten(ctx: CheckContext, el: Element): void {
  ctx.warn("html.too-deep", "note", MESSAGES.tooDeep, "html", elementLocation(el));
  setText(el, textContent(el));
}

function bgmBox(ctx: CheckContext, el: Element): Element {
  const src = getAttr(el, "src") ?? "";
  const file = src.split("/").pop() || "music.mid";
  const label = MESSAGES.bgmPlaying(file);
  const index = ctx.addAsset({
    name: file,
    resolved: label,
    fakeBytes: FAKE_BYTES.bgm,
    kind: "bgm",
  });
  if (ctx.mode !== "net") return pluginBox(label);
  const box = pluginBox(MESSAGES.bgmLoading);
  setAttr(box, `${KIT_ATTR_PREFIX}bgm`, String(index));
  return box;
}

/** 使えないタグを中身だけにする前に、style 属性の警告を拾う */
function precheckStyle(ctx: CheckContext, el: Element): void {
  const style = getAttr(el, "style");
  if (style !== undefined) filterStyleAttribute(ctx, style, attrValueLocation(ctx, el, "style"));
}

function processTag(ctx: CheckContext, el: Element, tag: string): Action | null {
  const loc = elementLocation(el);
  switch (tag) {
    case "script":
      ctx.warn("html.script", "note", MESSAGES.script, "js", loc);
      return "remove";
    case "noscript":
      return "unwrap";
    case "link":
      ctx.warn("html.link", "note", MESSAGES.link, "css", loc);
      return "remove";
    case "embed":
    case "bgsound":
      return bgmBox(ctx, el);
    case "input":
      if ((getAttr(el, "type") ?? "").trim().toLowerCase() === "password") {
        ctx.warn("html.password", "note", MESSAGES.password, "html", loc);
        return "remove";
      }
      return null;
    case "meta": {
      const equiv = (getAttr(el, "http-equiv") ?? "").trim().toLowerCase();
      if (equiv === "refresh") {
        ctx.warn("html.meta-refresh", "note", MESSAGES.refresh, "html", loc);
        return "remove";
      }
      // 公開版は UTF-8 で配信するので、文字コードの指定を外す
      if (
        ctx.mode === "publish" &&
        (equiv === "content-type" || getAttr(el, "charset") !== undefined)
      ) {
        return "remove";
      }
      return null;
    }
  }
  if (FRAME_TAGS.has(tag)) {
    ctx.warn("html.frame", "note", MESSAGES.frame, "html", loc);
    return "unwrap";
  }
  const media = Object.hasOwn(MEDIA_FEATURES, tag) ? MEDIA_FEATURES[tag] : undefined;
  if (media) {
    ctx.blocked(media, `html.element.${tag}`, MESSAGES.media(tag), "js", loc);
    return pluginBox(MESSAGES.plugin);
  }
  if (EMBED_TAGS.has(tag)) {
    ctx.warn(`html.element.${tag}`, "note", MESSAGES.embed(tag), "html", loc);
    return pluginBox(MESSAGES.plugin);
  }

  const feature = Object.hasOwn(TAG_FEATURES, tag) ? TAG_FEATURES[tag] : undefined;
  if (feature) {
    const message = HTML5_TAGS.has(tag)
      ? MESSAGES.html5Tag(tag, ctx.year)
      : MESSAGES.unknownTag(tag, ctx.year);
    const status = featureStatus(feature, ctx.year);
    if (status === "future" || status === "partial") precheckStyle(ctx, el);
    if (
      ctx.blocked(feature, `html.element.${tag}`, message, "html", loc, MESSAGES.outdatedTag(tag))
    ) {
      return "unwrap";
    }
    return null;
  }
  if (!BASIC_TAGS.has(tag)) {
    precheckStyle(ctx, el);
    ctx.warn("html.element.unknown", "future", MESSAGES.unknownTag(tag, ctx.year), "html", loc);
    return "unwrap";
  }
  return null;
}

function processHref(ctx: CheckContext, el: Element, href: string, loc?: SourceLocation): void {
  const kind = linkKind(href);
  if (kind === "blocked") {
    ctx.warn("html.url-scheme", "note", SCHEME_MESSAGE, "js", loc);
    removeAttr(el, "href");
  } else if (kind === "external") {
    setAttr(el, "rel", EXTERNAL_REL);
  }
}

function processBackground(
  ctx: CheckContext,
  el: Element,
  value: string,
  loc?: SourceLocation,
): void {
  const { url, fakeBytes } = ctx.resolveAsset(value, loc);
  if (url === "") {
    removeAttr(el, "background");
    return;
  }
  const index = ctx.addAsset({ name: value, resolved: url, fakeBytes, kind: "background" });
  if (ctx.mode === "net") {
    removeAttr(el, "background");
    setAttr(el, `${KIT_ATTR_PREFIX}bg`, String(index));
  } else {
    setAttr(el, "background", url);
  }
}

function processAttributes(ctx: CheckContext, el: Element, tag: string): void {
  // removeAttr は el.attrs を新しい配列に差し替えるので、元の配列をそのまま回せる
  for (const { name, value } of el.attrs) {
    const loc = attrLocation(el, name);
    if (name.startsWith("on")) {
      ctx.warn("html.event-attr", "note", MESSAGES.eventAttr, "js", loc);
      removeAttr(el, name);
      continue;
    }
    const html5 = html5AttributeFeature(name);
    if (html5 && ctx.blocked(html5, "html.attr.html5", MESSAGES.html5Attr(name), "html", loc)) {
      removeAttr(el, name);
      continue;
    }
    if (
      name.startsWith(KIT_ATTR_PREFIX) ||
      DROPPED_URL_ATTRS.has(name) ||
      (tag === "form" && FORM_DROPPED_ATTRS.has(name)) ||
      (name === "src" && tag !== "img" && tag !== "input")
    ) {
      removeAttr(el, name);
      continue;
    }
    if (name === "style") {
      const css = filterStyleAttribute(ctx, value, attrValueLocation(ctx, el, name));
      if (css === "") removeAttr(el, name);
      else setAttr(el, name, css);
    } else if (name === "background") {
      processBackground(ctx, el, value, loc);
    } else if (name === "href") {
      processHref(ctx, el, value, loc);
    } else if (
      name === "bgcolor" &&
      TABLE_TAGS.has(tag) &&
      ctx.blocked(
        "html.table-bgcolor",
        "html.attr.bgcolor",
        MESSAGES.tableBgcolor(ctx.year),
        "html",
        loc,
      )
    ) {
      removeAttr(el, name);
    }
  }
}

function processImageSource(ctx: CheckContext, el: Element, tag: string): void {
  const src = getAttr(el, "src");
  if (src === undefined) return;
  const { url, fakeBytes } = ctx.resolveAsset(src, attrLocation(el, "src"));
  if (url === "") {
    removeAttr(el, "src");
    return;
  }
  if (tag !== "img") {
    setAttr(el, "src", url);
    return;
  }
  const index = ctx.addAsset({ name: src, resolved: url, fakeBytes, kind: "img" });
  if (ctx.mode === "net") {
    setAttr(el, `${KIT_ATTR_PREFIX}img`, String(index));
    setAttr(el, "src", toDataUri(PENDING_IMAGE.svg));
  } else {
    setAttr(el, "src", url);
  }
}

function processStyleElement(ctx: CheckContext, el: Element): void {
  const first = el.childNodes[0];
  const loc = first?.sourceCodeLocation ?? el.sourceCodeLocation?.startTag;
  const start = loc
    ? first?.sourceCodeLocation
      ? { line: loc.startLine, col: loc.startCol }
      : { line: loc.endLine, col: loc.endCol }
    : { line: 1, col: 1 };
  setText(el, filterStyleSheet(ctx, textContent(el), start));
}

function processElement(ctx: CheckContext, el: Element): Action {
  const tag = el.tagName.toLowerCase();
  const action = processTag(ctx, el, tag);
  if (action !== null) return action;

  processAttributes(ctx, el, tag);
  if (tag === "input") {
    const type = (getAttr(el, "type") ?? "").trim().toLowerCase();
    if (
      HTML5_INPUT_TYPES.has(type) &&
      ctx.blocked(
        "html5.input-types",
        "html.input-type",
        MESSAGES.inputType(type),
        "html",
        elementLocation(el),
      )
    ) {
      setAttr(el, "type", "text");
    }
  }
  if (tag === "img" || tag === "input") processImageSource(ctx, el, tag);
  if (tag === "style") processStyleElement(ctx, el);
  return "keep";
}

/** <!--COUNTER--> を置き換える */
function processComment(ctx: CheckContext, node: T.CommentNode, digits: string): ChildNode[] {
  if (!/^\s*COUNTER\s*$/i.test(node.data)) return [node];
  const index = ctx.addAsset({
    name: "cgi-bin/count.cgi",
    resolved: ctx.mode === "publish" ? "" : digits,
    fakeBytes: FAKE_BYTES.counter,
    kind: "counter",
  });
  if (ctx.mode === "publish") {
    node.data = "COUNTER";
    return [node];
  }
  if (ctx.mode === "local") return [createElement("span", { class: "__ctr" }, digits)];
  return [
    createElement(
      "span",
      { class: "__ctr __cgi", [`${KIT_ATTR_PREFIX}ctr`]: String(index) },
      "------",
    ),
  ];
}

/** 要素を処理し、その場所に入るノードを返す */
function walkElement(ctx: CheckContext, el: Element, depth: number, digits: string): ChildNode[] {
  // 深い入れ子は直列化でスタックを使い切るので、上限より下は文字だけにする
  if (depth >= MAX_DEPTH && childrenOf(el).some((n) => isElement(n))) flatten(ctx, el);
  const action = processElement(ctx, el);
  if (action === "remove") return [];
  if (typeof action === "object") return [action];
  walkChildren(ctx, el, depth + 1, digits);
  return action === "unwrap" ? [...childrenOf(el)] : [el];
}

/** 子を文書順に処理し、子の並びを 1 回で組み直す */
export function walkChildren(
  ctx: CheckContext,
  parent: ParentNode,
  depth: number,
  digits: string,
): void {
  const kids = childrenOf(parent);
  const next: ChildNode[] = [];
  for (const node of kids) {
    const placed = isElement(node)
      ? walkElement(ctx, node, depth, digits)
      : node.nodeName === "#comment"
        ? processComment(ctx, node as T.CommentNode, digits)
        : [node];
    for (const n of placed) {
      n.parentNode = parent;
      next.push(n);
    }
  }
  kids.length = 0;
  for (const n of next) kids.push(n);
}

/** ルートの html 要素を処理する */
export function walkRoot(ctx: CheckContext, root: Element, digits: string): void {
  processAttributes(ctx, root, "html");
  walkChildren(ctx, root, 1, digits);
}
