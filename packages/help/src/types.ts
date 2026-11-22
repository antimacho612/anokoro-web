import type { TopicId } from "@anokoro/era-checker";
import type { Source, YearRange } from "@anokoro/era-data";

/** 本文の断片。years の範囲外の年では表示しない */
export interface HelpSegment {
  html: string;
  years: YearRange;
  /** 末尾の「参考」。本文がない年は、これだけではトピックを出さない */
  reference?: true;
}

export interface HelpTopic<Id extends string = TopicId> {
  id: Id;
  title: string;
  /** このトピックのタブを出す年の範囲 */
  years: YearRange;
  sources: readonly Source[];
  /** 本文。末尾に「参考」を含む。順につなげると 1 つの HTML になる */
  segments: readonly HelpSegment[];
}
