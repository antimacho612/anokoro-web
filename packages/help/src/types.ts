import type { TopicId } from "@anokoro/era-checker";
import type { Source, YearRange } from "@anokoro/era-data";

export interface HelpSegment {
  html: string;
  years: YearRange;
  reference?: true;
}

export interface HelpTopic<Id extends string = TopicId> {
  id: Id;
  title: string;
  years: YearRange;
  sources: readonly Source[];
  segments: readonly HelpSegment[];
}
