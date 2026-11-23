import { generate, parse, walk } from "css-tree";
import type {
  Atrule,
  Block,
  CssLocation,
  CssNode,
  Declaration,
  List,
  Rule,
  Selector,
} from "css-tree";
import type { CheckContext } from "./context.ts";
import {
  AT_RULE_FEATURES,
  AT_RULE_MESSAGES,
  CSS_DECL_RULES,
  CSS_SELECTOR_RULES,
  UNSAFE_CSS_FUNCTIONS,
  type DeclInfo,
} from "./css-rules.ts";
import type { SourceLocation } from "./types.ts";

const CSS_BASIC_MESSAGE =
  "スタイルシート（CSS）はまだ普及していません。見た目はfontタグとtableで整えましょう";

/** CSS の文字列が元のソースのどこから始まるか */
export type CssStart = SourceLocation;

const noop = (): void => {};

function toLocation(loc: CssLocation | undefined): SourceLocation | undefined {
  return loc ? { line: loc.start.line, col: loc.start.column } : undefined;
}

/** style 要素の中で `</style>` を作れないようにする */
function escapeForStyle(css: string): string {
  return css.replace(/<\//g, "<\\/");
}

/** 宣言を選別する。残すなら true（url() は素材に書き換える） */
function keepDeclaration(ctx: CheckContext, decl: Declaration): boolean {
  const prop = decl.property.toLowerCase();
  const loc = toLocation(decl.loc);
  const functions = new Set<string>();
  const units = new Set<string>();
  let rawWithFunction = false;
  walk(decl.value, (node) => {
    if (node.type === "Function") functions.add(node.name.toLowerCase());
    else if (node.type === "Dimension") units.add(node.unit.toLowerCase());
    else if (node.type === "Raw" && /[(\\]/.test(node.value)) rawWithFunction = true;
  });
  const info: DeclInfo = { prop, value: generate(decl.value), functions, units };

  for (const rule of CSS_DECL_RULES) {
    const feature = rule.match(info);
    if (feature && ctx.blocked(feature, rule.id, rule.message(prop), "css", loc)) return false;
  }

  for (const name of functions) {
    if (UNSAFE_CSS_FUNCTIONS.has(name)) {
      ctx.warn(
        "css.unsafe-function",
        "note",
        `「${name}()」はこのキットでは使えません`,
        "css",
        loc,
      );
      return false;
    }
  }
  // 解析できなかった値の中に url() などが隠れていることがあるので、関数らしきものは捨てる
  if (rawWithFunction) return false;

  let ok = true;
  walk(decl.value, (node) => {
    if (node.type !== "Url") return;
    const { url } = ctx.resolveAsset(node.value, loc);
    if (url === "") ok = false;
    else node.value = url;
  });
  return ok;
}

function filterDeclarations(ctx: CheckContext, children: List<CssNode>): List<CssNode> {
  return children.filter((node) => node.type === "Declaration" && keepDeclaration(ctx, node));
}

function keepSelector(ctx: CheckContext, selector: Selector): boolean {
  const loc = toLocation(selector.loc);
  for (const rule of CSS_SELECTOR_RULES) {
    for (const feature of rule.features(selector)) {
      if (ctx.blocked(feature, rule.id, rule.message, "css", loc)) return false;
    }
  }
  return true;
}

function keepRule(ctx: CheckContext, rule: Rule, inKeyframes: boolean): boolean {
  if (!inKeyframes) {
    if (rule.prelude.type !== "SelectorList") return false;
    const selectors = rule.prelude.children.filter(
      (s) => s.type === "Selector" && keepSelector(ctx, s),
    );
    if (selectors.isEmpty) return false;
    rule.prelude.children = selectors;
  }
  rule.block.children = filterDeclarations(ctx, rule.block.children);
  return true;
}

function filterBlockRules(ctx: CheckContext, block: Block, inKeyframes = false): void {
  block.children = filterRuleList(ctx, block.children, inKeyframes);
}

function keepAtrule(ctx: CheckContext, at: Atrule): boolean {
  const name = at.name.toLowerCase();
  const loc = toLocation(at.loc);
  const block = at.block;

  if (!block) {
    if (name !== "charset") ctx.warn("css.import", "note", AT_RULE_MESSAGES.import, "css", loc);
    return false;
  }
  if (name === "media") {
    const prelude = at.prelude ? generate(at.prelude) : "";
    if (
      prelude.includes("(") &&
      ctx.blocked("css.media-queries", "css.media", AT_RULE_MESSAGES.media, "css", loc)
    ) {
      return false;
    }
    filterBlockRules(ctx, block);
    return true;
  }
  if (name === "font-face") {
    if (ctx.blocked("css.font-face", "css.font-face", AT_RULE_MESSAGES.fontFace, "css", loc)) {
      return false;
    }
    block.children = filterDeclarations(ctx, block.children);
    return true;
  }
  if (/^(-[a-z]+-)?keyframes$/.test(name)) {
    if (ctx.blocked("css.animation", "css.motion", AT_RULE_MESSAGES.keyframes, "css", loc)) {
      return false;
    }
    filterBlockRules(ctx, block, true);
    return true;
  }
  const feature = Object.hasOwn(AT_RULE_FEATURES, name) ? AT_RULE_FEATURES[name] : undefined;
  if (feature) {
    const message = AT_RULE_MESSAGES.unknown(name);
    if (ctx.blocked(feature, `css.at-rule.${name}`, message, "css", loc)) return false;
    filterBlockRules(ctx, block);
    return true;
  }
  ctx.warn("css.at-rule", "future", AT_RULE_MESSAGES.unknown(name), "css", loc);
  return false;
}

function filterRuleList(
  ctx: CheckContext,
  children: List<CssNode>,
  inKeyframes: boolean,
): List<CssNode> {
  return children.filter((node) => {
    if (node.type === "Rule") return keepRule(ctx, node, inKeyframes);
    if (node.type === "Atrule") return keepAtrule(ctx, node);
    return false;
  });
}

function cssBlocked(ctx: CheckContext, start: CssStart): boolean {
  return ctx.blocked("css.basic", "css.basic", CSS_BASIC_MESSAGE, "css", start);
}

/** style 属性の中身を選別し、残った宣言を返す（空なら属性ごと取り除く） */
export function filterStyleAttribute(ctx: CheckContext, text: string, start: CssStart): string {
  if (text.trim() === "") return "";
  if (cssBlocked(ctx, start)) return "";
  const ast = parse(text, {
    context: "declarationList",
    positions: true,
    line: start.line,
    column: start.col,
    onParseError: noop,
  });
  if (ast.type !== "DeclarationList") return "";
  ast.children = filterDeclarations(ctx, ast.children);
  return generate(ast);
}

export function filterStyleSheet(ctx: CheckContext, text: string, start: CssStart): string {
  if (text.trim() === "") return "";
  if (cssBlocked(ctx, start)) return "";
  const ast = parse(text, {
    positions: true,
    line: start.line,
    column: start.col,
    onParseError: noop,
  });
  if (ast.type !== "StyleSheet") return "";
  ast.children = filterRuleList(ctx, ast.children, false);
  return escapeForStyle(generate(ast));
}
