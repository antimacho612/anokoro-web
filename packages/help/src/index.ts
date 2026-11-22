import type { TopicId } from "@anokoro/era-checker";
import { inRange, type Year } from "@anokoro/era-data";
import type { HelpTopic } from "./types.ts";

export type { HelpSegment, HelpTopic } from "./types.ts";

/** どのトピックも開いていないときに出すトピック */
export const DEFAULT_TOPIC: TopicId = "timeline";

export function topicsForYear(topics: readonly HelpTopic[], year: Year): HelpTopic[] {
  return topics.filter(
    (topic) =>
      inRange(year, topic.years) &&
      topic.segments.some((segment) => !segment.reference && inRange(year, segment.years)),
  );
}

/**
 * 開くトピックを決める。wanted がその年に出せなければ既定のトピック、
 * それも出せなければ最初のトピックにする
 */
export function resolveTopic(
  topics: readonly HelpTopic[],
  year: Year,
  wanted: TopicId | null,
): HelpTopic | undefined {
  const shown = topicsForYear(topics, year);
  return (
    shown.find((topic) => topic.id === wanted) ??
    shown.find((topic) => topic.id === DEFAULT_TOPIC) ??
    shown[0]
  );
}

/** その年までの内容だけを残した本文 */
export function topicHtml(topic: HelpTopic, year: Year): string {
  return topic.segments
    .filter((segment) => inRange(year, segment.years))
    .map((segment) => segment.html)
    .join("");
}
