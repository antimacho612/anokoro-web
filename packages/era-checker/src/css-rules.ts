import type { FeatureId } from "@anokoro/era-data";
import type { CssNode, Selector } from "css-tree";

/** 判定に使う宣言の情報 */
export interface DeclInfo {
  /** 小文字のプロパティ名 */
  prop: string;
  /** 値の文字列 */
  value: string;
  /** 値に含まれる関数名（小文字） */
  functions: ReadonlySet<string>;
  /** 値に含まれる単位（小文字） */
  units: ReadonlySet<string>;
}

/**
 * 宣言のルール。match は当てはまった機能を返す（当てはまらなければ null）。
 * 上から順に調べ、選んだ年に使えない最初のルールで宣言を取り除く。
 */
export interface CssDeclRule {
  id: string;
  match: (d: DeclInfo) => FeatureId | null;
  message: (prop: string) => string;
}

const PROP_FEATURES: Readonly<Record<string, FeatureId>> = {
  gap: "css.gap",
  "row-gap": "css.gap",
  "column-gap": "css.gap",
  "object-fit": "css.object-fit",
  "background-size": "css.background-size",
  "box-sizing": "css.box-sizing",
  "aspect-ratio": "css.aspect-ratio",
  inset: "css.inset",
  columns: "css.columns",
  "column-count": "css.columns",
  filter: "css.filter",
  "backdrop-filter": "css.filter",
  mask: "css.mask",
  "clip-path": "css.mask",
  "place-items": "css.gap",
  "justify-content": "css.flex",
  "align-items": "css.flex",
};

const when =
  (test: (d: DeclInfo) => boolean, feature: FeatureId) =>
  (d: DeclInfo): FeatureId | null =>
    test(d) ? feature : null;

const hasFunction = (d: DeclInfo, test: (name: string) => boolean): boolean =>
  [...d.functions].some(test);

export const CSS_DECL_RULES: readonly CssDeclRule[] = [
  {
    id: "css.display",
    match: ({ prop, value }) => {
      if (prop !== "display") return null;
      if (/grid/i.test(value)) return "css.grid";
      if (/flex/i.test(value)) return "css.flex";
      return null;
    },
    message: () =>
      "display:flex / grid はまだ存在しません（2009年以降）。レイアウトはtableで組みましょう",
  },
  {
    id: "css.border-radius",
    match: when((d) => d.prop === "border-radius", "css.border-radius"),
    message: () => "角丸（border-radius）はIE6では使えません。四隅に角丸画像を置くのが定番です",
  },
  {
    id: "css.box-shadow",
    match: when((d) => d.prop === "box-shadow", "css.box-shadow"),
    message: () => "box-shadow は使えません。影は画像で作る時代です",
  },
  {
    id: "css.text-shadow",
    match: when((d) => d.prop === "text-shadow", "css.text-shadow"),
    message: () => "text-shadow はIE6では表示されません",
  },
  {
    id: "css.opacity",
    match: when((d) => d.prop === "opacity", "css.opacity"),
    message: () => "opacity はIE6では使えません（filter:alpha(opacity=50) の時代です）",
  },
  {
    id: "css.transform",
    match: when((d) => /(^|-)transform$/.test(d.prop), "css.transform"),
    message: () => "transform はまだありません",
  },
  {
    id: "css.motion",
    match: ({ prop }) => {
      const m = /(^|-)(transition|animation)/.exec(prop);
      if (!m) return null;
      return m[2] === "transition" ? "css.transition" : "css.animation";
    },
    message: () => "CSSアニメーションはまだありません。動かすならGIFアニメかmarqueeで",
  },
  {
    id: "css.position",
    match: ({ prop, value }) => {
      if (prop !== "position") return null;
      if (/sticky/i.test(value)) return "css.position-sticky";
      if (/fixed/i.test(value)) return "css.position-fixed";
      return null;
    },
    message: () => "position:fixed / sticky はIE6では効きません",
  },
  {
    id: "css.max-min",
    match: when((d) => /^(max|min)-(width|height)$/.test(d.prop), "css.max-min"),
    message: () => "max-width / min-height などはIE6では効きません",
  },
  {
    id: "css.property",
    match: ({ prop }) =>
      Object.hasOwn(PROP_FEATURES, prop) ? (PROP_FEATURES[prop] ?? null) : null,
    message: (prop) => `「${prop}」はまだ使えないプロパティです`,
  },
  {
    id: "css.rgba",
    match: when((d) => hasFunction(d, (f) => /^(rgba|hsla?)$/.test(f)), "css.rgba"),
    message: () => "半透明色（rgba / hsl）はまだ使えません",
  },
  {
    id: "css.variables",
    match: when((d) => d.functions.has("var") || d.prop.startsWith("--"), "css.variables"),
    message: () => "CSS変数はまだありません",
  },
  {
    id: "css.calc",
    match: when((d) => hasFunction(d, (f) => f.endsWith("calc")), "css.calc"),
    message: () => "calc() はまだありません",
  },
  {
    id: "css.gradient",
    match: when((d) => hasFunction(d, (f) => f.includes("gradient")), "css.gradient"),
    message: () => "CSSグラデーションはまだありません。グラデーションは画像で作りましょう",
  },
  {
    id: "css.units",
    match: ({ units }) => {
      if (units.has("vw") || units.has("vh")) return "css.viewport-units";
      if (units.has("rem")) return "css.rem";
      return null;
    },
    message: () => "vw / vh / rem 単位はまだありません。px か % で指定しましょう",
  },
];

/**
 * 外部の画像やスクリプトを読み込める関数。年に関係なく宣言ごと取り除く。
 * url() は素材に解決するので含めない。
 */
export const UNSAFE_CSS_FUNCTIONS: ReadonlySet<string> = new Set([
  "image-set",
  "-webkit-image-set",
  "cross-fade",
  "-webkit-cross-fade",
  "element",
  "-moz-element",
  "paint",
  "src",
  "image",
  "expression",
]);

/**
 * セレクタのルール。features は当てはまった機能を出た順に返す。
 * 1 つのセレクタにつき、選んだ年に使えない最初のルールで警告して取り除く。
 */
export interface CssSelectorRule {
  id: string;
  features: (selector: Selector) => FeatureId[];
  message: string;
}

const nodesOf = (selector: Selector): CssNode[] => selector.children.toArray();

const PSEUDO_CLASS_FEATURES: readonly (readonly [prefix: string, feature: FeatureId])[] = [
  ["nth-", "css.selector.structural"],
  ["not", "css.selector.structural"],
  ["first-child", "css.selector.first-child"],
  ["last-child", "css.selector.structural"],
  ["before", "css.selector.before-after"],
  ["after", "css.selector.before-after"],
  ["focus", "css.selector.focus"],
  ["checked", "css.selector.structural"],
  ["is", "css.selector.modern"],
  ["where", "css.selector.modern"],
  ["has", "css.selector.modern"],
  ["root", "css.selector.structural"],
  ["empty", "css.selector.structural"],
];

/** a 以外の要素に付いた :hover があるか */
function hoverOnNonAnchor(selector: Selector): boolean {
  let type: string | null = null;
  for (const node of nodesOf(selector)) {
    if (node.type === "Combinator") type = null;
    else if (node.type === "TypeSelector") type = node.name.toLowerCase();
    else if (node.type === "PseudoClassSelector" && node.name.toLowerCase() === "hover") {
      if (type !== "a") return true;
    }
  }
  return false;
}

export const CSS_SELECTOR_RULES: readonly CssSelectorRule[] = [
  {
    id: "css.selector.pseudo-element",
    features: (s) =>
      nodesOf(s).some((n) => n.type === "PseudoElementSelector")
        ? ["css.selector.pseudo-element"]
        : [],
    message: "::before などの擬似要素はIE6では使えません",
  },
  {
    id: "css.selector.child",
    features: (s) =>
      nodesOf(s).some((n) => n.type === "Combinator" && n.name === ">")
        ? ["css.selector.child"]
        : [],
    message: "子セレクタ「>」はIE6では使えません",
  },
  {
    id: "css.selector.attribute",
    features: (s) =>
      nodesOf(s).some((n) => n.type === "AttributeSelector") ? ["css.selector.attribute"] : [],
    message: "属性セレクタ [ ] はIE6では使えません",
  },
  {
    id: "css.selector.sibling",
    features: (s) =>
      nodesOf(s).some((n) => n.type === "Combinator" && (n.name === "+" || n.name === "~"))
        ? ["css.selector.sibling"]
        : [],
    message: "隣接・兄弟セレクタ（+ ~）はIE6では使えません",
  },
  {
    id: "css.selector.pseudo-class",
    features: (s) =>
      nodesOf(s).flatMap((n) => {
        if (n.type !== "PseudoClassSelector") return [];
        const name = n.name.toLowerCase();
        const hit = PSEUDO_CLASS_FEATURES.find(([prefix]) => name.startsWith(prefix));
        return hit ? [hit[1]] : [];
      }),
    message: "この擬似クラスはIE6では使えません",
  },
  {
    id: "css.selector.hover",
    features: (s) => (hoverOnNonAnchor(s) ? ["css.selector.hover-any"] : []),
    message: ":hover はIE6ではaタグにしか効きません",
  },
];

/** ブロックを持つ @ ルールの機能と警告文 */
export const AT_RULE_MESSAGES = {
  media: "メディアクエリ @media (…) はまだありません。画面は800×600決め打ちの時代です",
  fontFace: "Webフォントは事実上使えません。MS Pゴシックで勝負しましょう",
  keyframes: "CSSアニメーションはまだありません。動かすならGIFアニメかmarqueeで",
  import: "@import など外部CSSの読み込みはこのキットでは未対応です",
  unknown: (name: string): string => `「@${name}」はまだ存在しません`,
} as const;

export const AT_RULE_FEATURES: Readonly<Record<string, FeatureId>> = {
  supports: "css.supports",
  layer: "css.layer-container",
  container: "css.layer-container",
};
