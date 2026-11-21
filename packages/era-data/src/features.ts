import { caniuse, SRC } from "./sources.ts";
import type { Source, Year } from "./years.ts";

/**
 * 機能年表の 1 行。
 * 年は「日本の主流ブラウザ（原則として IE）で普通に使えるようになった年」。
 */
export interface FeatureEntry {
  /** 機能の説明 */
  label: string;
  /** 使えるようになった年。null は対象の最終年までは使えない */
  availableFrom: Year | null;
  /** IE 以外の一部のブラウザが先に対応した年 */
  partialFrom?: Year;
  /** この年から「もう古い書き方」とみなす */
  outdatedFrom?: Year;
  /** 根拠（1 件以上） */
  sources: readonly Source[];
}

export const FEATURES = {
  // ---- HTML ----
  "html.basic": {
    label: "table・font・center・img などの基本タグ",
    availableFrom: 1995,
    sources: [SRC.html32, SRC.ieHistory],
  },
  "html.table-bgcolor": {
    label: "背景色付きの表（table・td の bgcolor）",
    availableFrom: 1996,
    sources: [SRC.html401, SRC.ieHistory],
  },
  "html.frameset": {
    label: "frameset・frame",
    availableFrom: 1996,
    sources: [SRC.html401, SRC.ieHistory],
  },
  "html.marquee": {
    label: "marquee",
    availableFrom: 1996,
    outdatedFrom: 2008,
    sources: [SRC.ieHistory, SRC.obsolete],
  },
  "html.blink": {
    label: "blink",
    availableFrom: 1995,
    outdatedFrom: 2008,
    sources: [SRC.blink, SRC.obsolete],
  },
  "html5.semantic": {
    label: "HTML5 の構造タグ（section・article・nav など）",
    availableFrom: 2011,
    partialFrom: 2008,
    sources: [caniuse("html5semantic", "New semantic elements"), SRC.ieHistory],
  },
  "html5.video": {
    label: "video・audio",
    availableFrom: 2011,
    partialFrom: 2009,
    sources: [caniuse("video", "Video element"), caniuse("audio", "Audio element")],
  },
  "html5.canvas": {
    label: "canvas",
    availableFrom: 2011,
    partialFrom: 2008,
    sources: [caniuse("canvas", "Canvas (basic support)")],
  },
  "html5.svg": {
    label: "HTML に直接書く svg",
    availableFrom: 2011,
    sources: [caniuse("svg-html5", "Inline SVG in HTML5")],
  },
  "html5.math": {
    label: "math（MathML）",
    availableFrom: null,
    sources: [caniuse("mathml", "MathML")],
  },
  "html5.picture": {
    label: "picture・srcset",
    availableFrom: null,
    partialFrom: 2014,
    sources: [
      caniuse("picture", "Picture element"),
      caniuse("srcset", "Srcset and sizes attributes"),
    ],
  },
  "html5.form-attributes": {
    label: "placeholder・required・autofocus・pattern などのフォーム属性",
    availableFrom: 2012,
    partialFrom: 2010,
    sources: [
      caniuse("input-placeholder", "input placeholder attribute"),
      caniuse("form-validation", "Form validation"),
    ],
  },
  "html5.input-types": {
    label: "input の新しい type（email・date・range など）",
    availableFrom: 2012,
    sources: [
      caniuse("input-email-tel-url", "Email, telephone & URL input types"),
      caniuse("input-range", "Range input type"),
    ],
  },

  // ---- JavaScript ----
  "js.dhtml": {
    label: "JavaScript の演出パーツ（DHTML）",
    availableFrom: 1997,
    sources: [SRC.ieHistory],
  },

  // ---- CSS: 基本 ----
  "css.basic": {
    label: "基本的な CSS（文字色、大きさ、余白、背景）",
    availableFrom: 1997,
    partialFrom: 1996,
    sources: [SRC.css1, SRC.ieHistory],
  },

  // ---- CSS: セレクタ ----
  "css.selector.child": {
    label: "子セレクタ「>」",
    availableFrom: 2006,
    sources: [caniuse("css-sel2", "CSS 2.1 selectors")],
  },
  "css.selector.attribute": {
    label: "属性セレクタ [ ]",
    availableFrom: 2006,
    sources: [caniuse("css-sel2", "CSS 2.1 selectors")],
  },
  "css.selector.sibling": {
    label: "隣接・兄弟セレクタ（+ ~）",
    availableFrom: 2006,
    sources: [caniuse("css-sel2", "CSS 2.1 selectors"), caniuse("css-sel3", "CSS3 selectors")],
  },
  "css.selector.first-child": {
    label: ":first-child",
    availableFrom: 2006,
    sources: [caniuse("css-sel2", "CSS 2.1 selectors")],
  },
  "css.selector.hover-any": {
    label: "a 以外への :hover",
    availableFrom: 2006,
    sources: [caniuse("css-sel2", "CSS 2.1 selectors")],
  },
  "css.selector.focus": {
    label: ":focus",
    availableFrom: 2009,
    sources: [caniuse("css-sel2", "CSS 2.1 selectors"), SRC.ieHistory],
  },
  "css.selector.before-after": {
    label: ":before・:after",
    availableFrom: 2009,
    sources: [caniuse("css-gencontent", "CSS Generated content for pseudo-elements")],
  },
  "css.selector.pseudo-element": {
    label: "擬似要素の :: 記法",
    availableFrom: 2011,
    sources: [caniuse("css-gencontent", "CSS Generated content for pseudo-elements")],
  },
  "css.selector.structural": {
    label: ":nth-*・:not・:last-child・:root・:empty・:checked",
    availableFrom: 2011,
    partialFrom: 2009,
    sources: [caniuse("css-sel3", "CSS3 selectors")],
  },
  "css.selector.modern": {
    label: ":is・:where・:has",
    availableFrom: null,
    sources: [
      caniuse("css-matches-pseudo", ":is() CSS pseudo-class"),
      caniuse("css-has", ":has() CSS relational pseudo-class"),
    ],
  },

  // ---- CSS: レイアウト ----
  "css.max-min": {
    label: "max-width・min-height など",
    availableFrom: 2006,
    sources: [caniuse("minmaxwh", "CSS min/max-width/height")],
  },
  "css.position-fixed": {
    label: "position: fixed",
    availableFrom: 2006,
    sources: [caniuse("css-fixed", "CSS position:fixed")],
  },
  "css.position-sticky": {
    label: "position: sticky",
    availableFrom: null,
    sources: [caniuse("css-sticky", "CSS position:sticky")],
  },
  "css.box-sizing": {
    label: "box-sizing",
    availableFrom: 2009,
    sources: [caniuse("css3-boxsizing", "CSS3 Box-sizing")],
  },
  "css.columns": {
    label: "段組み（columns・column-count）",
    availableFrom: 2012,
    sources: [caniuse("multicolumn", "CSS3 Multiple column layout")],
  },
  "css.flex": {
    label: "flex（display: flex と justify-content・align-items）",
    availableFrom: 2013,
    partialFrom: 2012,
    sources: [caniuse("flexbox", "CSS Flexible Box Layout Module"), SRC.ieHistory],
  },
  "css.grid": {
    label: "grid",
    availableFrom: null,
    sources: [caniuse("css-grid", "CSS Grid Layout")],
  },
  "css.gap": {
    label: "gap・row-gap・column-gap・place-items",
    availableFrom: null,
    sources: [
      caniuse("flexbox-gap", "gap property for Flexbox"),
      caniuse("css-grid", "CSS Grid Layout"),
    ],
  },
  "css.inset": {
    label: "inset",
    availableFrom: null,
    sources: [caniuse("mdn-css_properties_inset", "CSS property: inset")],
  },
  "css.aspect-ratio": {
    label: "aspect-ratio",
    availableFrom: null,
    sources: [caniuse("mdn-css_properties_aspect-ratio", "CSS property: aspect-ratio")],
  },
  "css.object-fit": {
    label: "object-fit",
    availableFrom: null,
    sources: [caniuse("object-fit", "CSS3 object-fit/object-position")],
  },

  // ---- CSS: 装飾 ----
  "css.png-alpha": {
    label: "PNG の半透明",
    availableFrom: 2006,
    sources: [caniuse("png-alpha", "PNG alpha transparency")],
  },
  "css.border-radius": {
    label: "border-radius",
    availableFrom: 2011,
    partialFrom: 2008,
    sources: [caniuse("border-radius", "CSS3 Border-radius"), SRC.firefoxHistory],
  },
  "css.box-shadow": {
    label: "box-shadow",
    availableFrom: 2011,
    partialFrom: 2008,
    sources: [caniuse("css-boxshadow", "CSS3 Box-shadow")],
  },
  "css.text-shadow": {
    label: "text-shadow",
    availableFrom: 2012,
    partialFrom: 2009,
    sources: [caniuse("css-textshadow", "CSS3 Text-shadow")],
  },
  "css.opacity": {
    label: "opacity",
    availableFrom: 2011,
    sources: [caniuse("css-opacity", "CSS3 Opacity")],
  },
  "css.rgba": {
    label: "半透明色や HSL（rgba・hsl・hsla）",
    availableFrom: 2011,
    partialFrom: 2008,
    sources: [caniuse("css3-colors", "CSS3 Colors")],
  },
  "css.background-size": {
    label: "background-size",
    availableFrom: 2011,
    sources: [caniuse("background-img-opts", "CSS3 Background-image options")],
  },
  "css.gradient": {
    label: "グラデーション（*-gradient()）",
    availableFrom: 2012,
    partialFrom: 2009,
    sources: [caniuse("css-gradients", "CSS Gradients")],
  },
  "css.filter": {
    label: "filter・backdrop-filter",
    availableFrom: null,
    sources: [
      caniuse("css-filters", "CSS Filter Effects"),
      caniuse("css-backdrop-filter", "CSS Backdrop Filter"),
    ],
  },
  "css.mask": {
    label: "mask・clip-path",
    availableFrom: null,
    sources: [
      caniuse("css-masks", "CSS Masks"),
      caniuse("css-clip-path", "CSS clip-path property"),
    ],
  },

  // ---- CSS: 値と単位 ----
  "css.calc": {
    label: "calc()",
    availableFrom: 2011,
    sources: [caniuse("calc", "calc() as CSS unit value")],
  },
  "css.rem": {
    label: "rem 単位",
    availableFrom: 2011,
    sources: [caniuse("rem", "rem (root em) units")],
  },
  "css.viewport-units": {
    label: "vw・vh 単位",
    availableFrom: 2012,
    partialFrom: 2011,
    sources: [caniuse("viewport-units", "Viewport units: vw, vh, vmin, vmax")],
  },
  "css.variables": {
    label: "CSS 変数（--*・var()）",
    availableFrom: null,
    sources: [caniuse("css-variables", "CSS Variables (Custom Properties)")],
  },

  // ---- CSS: 動き ----
  "css.transform": {
    label: "transform",
    availableFrom: 2011,
    partialFrom: 2008,
    sources: [caniuse("transforms2d", "CSS3 2D Transforms")],
  },
  "css.transition": {
    label: "transition",
    availableFrom: 2012,
    partialFrom: 2008,
    sources: [caniuse("css-transitions", "CSS3 Transitions")],
  },
  "css.animation": {
    label: "animation・@keyframes",
    availableFrom: 2012,
    partialFrom: 2009,
    sources: [caniuse("css-animation", "CSS Animation")],
  },

  // ---- CSS: @ ルール ----
  "css.media-queries": {
    label: "条件付きのメディアクエリ @media (…)",
    availableFrom: 2011,
    partialFrom: 2009,
    sources: [caniuse("css-mediaqueries", "CSS3 Media Queries")],
  },
  "css.font-face": {
    label: "Web フォント @font-face",
    availableFrom: 2011,
    sources: [
      caniuse("fontface", "@font-face Web fonts"),
      caniuse("woff", "WOFF - Web Open Font Format"),
    ],
  },
  "css.supports": {
    label: "@supports",
    availableFrom: null,
    sources: [caniuse("css-featurequeries", "CSS Feature Queries")],
  },
  "css.layer-container": {
    label: "@layer・@container",
    availableFrom: null,
    sources: [
      caniuse("css-cascade-layers", "CSS Cascade Layers"),
      caniuse("css-container-queries", "CSS Container Queries (Size)"),
    ],
  },
} as const satisfies Record<string, FeatureEntry>;

export type FeatureId = keyof typeof FEATURES;

export type FeatureStatus =
  /** 使える */
  | "available"
  /** 使えるが、この年にはもう古い書き方 */
  | "outdated"
  /** 一部のブラウザでは使えたが、主流の IE ではまだ */
  | "partial"
  /** まだ使えない */
  | "future";

/** 選んだ年でその機能が使えるかを判定する */
export function featureStatus(id: FeatureId, year: Year): FeatureStatus {
  const feature: FeatureEntry = FEATURES[id];
  if (feature.availableFrom !== null && year >= feature.availableFrom) {
    return feature.outdatedFrom !== undefined && year >= feature.outdatedFrom
      ? "outdated"
      : "available";
  }
  if (feature.partialFrom !== undefined && year >= feature.partialFrom) return "partial";
  return "future";
}
