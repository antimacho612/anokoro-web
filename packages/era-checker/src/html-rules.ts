import type { FeatureId } from "@anokoro/era-data";

const words = (s: string): ReadonlySet<string> => new Set(s.split(/\s+/).filter(Boolean));

/** HTML 4.01 Transitional の表示系のタグ。いつの年でもそのまま残す */
export const BASIC_TAGS = words(`
  html head title meta style body a b i u s strike tt big small sub sup em strong font basefont
  center div span p br hr h1 h2 h3 h4 h5 h6 ul ol li dl dt dd menu dir table caption tr td th
  thead tbody tfoot col colgroup img map area form input select option optgroup textarea button
  label fieldset legend pre blockquote address cite code kbd samp var dfn abbr acronym q ins del
  nobr wbr
`);

/** 年によって使えるかが変わるタグ */
export const TAG_FEATURES: Readonly<Record<string, FeatureId>> = {
  marquee: "html.marquee",
  blink: "html.blink",
  ...Object.fromEntries(
    [...words("section article nav header footer aside main figure figcaption mark time")].map(
      (t) => [t, "html5.semantic" as const],
    ),
  ),
  ...Object.fromEntries(
    [...words("details summary dialog template output progress meter data slot search hgroup")].map(
      (t) => [t, "html5.other-elements" as const],
    ),
  ),
};

/** HTML5 のタグ（使えない年はアンラップする） */
export const HTML5_TAGS = new Set(
  Object.entries(TAG_FEATURES)
    .filter(([, f]) => f.startsWith("html5."))
    .map(([t]) => t),
);

/** 「プラグインが必要です」の箱に置き換えるタグ。安全のため、使える年でも置き換える */
export const MEDIA_FEATURES: Readonly<Record<string, FeatureId>> = {
  video: "html5.video",
  audio: "html5.video",
  canvas: "html5.canvas",
  svg: "html5.svg",
  math: "html5.math",
  picture: "html5.picture",
};

/** 外部のコンテンツを埋め込むタグ（いつでも箱に置き換える） */
export const EMBED_TAGS = words("iframe object");

export const FRAME_TAGS = words("frameset frame noframes");

/** HTML5 の属性と、その機能 */
export function html5AttributeFeature(name: string): FeatureId | null {
  if (name.startsWith("data-") || name.startsWith("aria-")) return "html5.global-attributes";
  if (HTML5_GLOBAL_ATTRS.has(name)) return "html5.global-attributes";
  if (HTML5_FORM_ATTRS.has(name)) return "html5.form-attributes";
  if (name === "srcset" || name === "sizes") return "html5.picture";
  return null;
}

const HTML5_GLOBAL_ATTRS = words("hidden download loading");
const HTML5_FORM_ATTRS = words("placeholder required autofocus pattern autocomplete");

export const HTML5_INPUT_TYPES = words(
  "email url tel number range date color search month week time datetime-local",
);

/** 表の背景色を付けられる要素 */
export const TABLE_TAGS = words("table thead tbody tfoot tr td th");

/** URL を持つが、キットでは使わない属性。黙って取り除く */
export const DROPPED_URL_ATTRS = words(`
  lowsrc dynsrc longdesc cite formaction ping poster srcdoc codebase classid archive profile
  manifest xmlns:xlink xlink:href
`);

/** form から取り除く属性（送信できなくする） */
export const FORM_DROPPED_ATTRS = words("action method target");

/** キットが内部で使う属性の接頭辞。ユーザーが書いたものは必ず取り除く */
export const KIT_ATTR_PREFIX = "data-anokoro-";

/** 文書の入れ子の上限。これより深い部分は文字だけにする */
export const MAX_DEPTH = 64;

export const MESSAGES = {
  script: "<script> はこのキットでは封印中です（動きはパーツで付けよう）",
  link: "外部CSSファイルはこのキットでは未対応です（<style> に書いてね）",
  frame: "フレームはこのキットでは未対応です",
  plugin: "このコンテンツを表示するにはプラグインが必要です",
  media: (tag: string): string =>
    `<${tag}> は表示できません（HTML5の機能です。当時ならFlashかプラグインの出番）`,
  embed: (tag: string): string => `<${tag}> は表示できません（外部コンテンツは読み込めません）`,
  html5Tag: (tag: string, year: number): string =>
    `<${tag}> はHTML5（2008年〜）のタグです。${year}年のブラウザは無視して中身だけ表示します`,
  unknownTag: (tag: string, year: number): string =>
    `<${tag}> は${year}年のブラウザが知らないタグです`,
  outdatedTag: (tag: string): string => `<${tag}> はこの頃にはもう古い書き方です`,
  eventAttr: "onclick などのイベント属性はこのキットでは封印中です",
  html5Attr: (name: string): string => `属性「${name}」はHTML5（2008年〜）以降の機能です`,
  inputType: (type: string): string =>
    `input type="${type}" はHTML5の機能です。ただのテキスト欄になります`,
  tableBgcolor: (year: number): string =>
    `表の背景色（bgcolor）は${year}年のブラウザではまだ使えません`,
  password: "パスワード欄はこのキットでは使えません（偽のログイン画面を作れないようにしています）",
  refresh: "meta refresh による自動の移動はこのキットでは未対応です",
  tooDeep: "入れ子が深すぎる部分は、文字だけにしました",
  bgmLoading: "♪ BGMを読み込んでいます...",
  bgmPlaying: (file: string): string => `♪ BGM再生中：${file}`,
} as const;
