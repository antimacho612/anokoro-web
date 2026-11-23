import type { TopicId } from "@anokoro/era-checker";
import type { FeatureId, SiteKindId, YearRange } from "@anokoro/era-data";

/** 属性の仕掛けを差し込めるタグ */
export type AttributeSlotTag = "input" | "img" | "a" | "table";

/**
 * お題の差し込み口の種類。
 * ソースには `{{quiz:<種類>}}` の形で書く。
 * block: ブロック要素を置ける行 / inline: 文中 / style: 開始タグの中（style 属性を足す） /
 * attr:<タグ>: そのタグの開始タグの中（属性を足す） / css: <style> の中の行（規則を足す）
 */
export type SlotKind = "block" | "inline" | "style" | "css" | `attr:${AttributeSlotTag}`;

/** 差し込み口へ入れる内容 */
export type TrickInsert =
  | { kind: "element"; slot: "block" | "inline"; html: string }
  | { kind: "attribute"; tag: AttributeSlotTag; name: string; value?: string }
  | { kind: "style"; declarations: string }
  | {
      kind: "rule";
      /** <style> に足す CSS の規則（1 行） */
      css: string;
      /** 規則で見た目が変わる要素を選ぶセレクター。表示モードの答えになる */
      target: string;
    };

/** サイトの種類と年の組み合わせごとのお題。仕掛けを入れなければ、使える年で警告ゼロ */
export interface QuizPage {
  /** 例: 'personal-1997' */
  id: string;
  kind: SiteKindId;
  /** このお題を使える出題年の範囲 */
  years: YearRange;
  /** 架空のホスト名を使った疑似 URL */
  url: string;
  /** HTML。仕掛けの差し込み口を含む */
  source: string;
}

/** お題に埋め込む、時代外れの技術の候補。時代チェッカーのルール 1 つに対応する */
export interface QuizTrick {
  id: string;
  /** 時代チェッカーのルール ID */
  ruleId: string;
  /** 時代チェッカーの警告のトピック */
  topic: TopicId;
  /** 機能年表のキー。出題できる年はここから決める */
  feature: FeatureId;
  /** 出題する年に使えている必要がある機能（例: CSS の仕掛けには css.basic） */
  requires?: readonly FeatureId[];
  insert: TrickInsert;
  /** 描画して見た目が変わるか */
  visible: boolean;
}
