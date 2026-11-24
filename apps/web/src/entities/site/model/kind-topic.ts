import type { TopicId } from "@anokoro/era-checker";
import { SITE_KINDS, type SiteKindId } from "@anokoro/era-data";

export function kindTopic(kind: SiteKindId): TopicId {
  return SITE_KINDS[kind].topic;
}
