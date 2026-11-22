import { join } from "node:path";
import { TOPIC_IDS } from "@anokoro/era-checker";
import { describe, expect, test } from "vite-plus/test";
import { loadHelpTopics } from "./load.ts";

const CONTENT_DIR = join(import.meta.dirname, "../../../content/help");

describe("content/help", () => {
  const { topics } = loadHelpTopics(CONTENT_DIR);

  test("警告が指すトピックがすべてそろっている", () => {
    expect(topics.map((t) => t.id).sort()).toEqual([...TOPIC_IDS].sort());
  });

  test("年表は選んだ年で止まる", () => {
    const timeline = topics.find((t) => t.id === "timeline");
    const items = timeline?.segments.filter((s) => s.html.startsWith("<li>")) ?? [];
    expect(items.length).toBeGreaterThan(0);
    for (const item of items) {
      expect(item.html).toContain(`<strong>${item.years[0]}`);
    }
  });

  test("本文にスクリプトを動かせる HTML を含まない", () => {
    const unsafe = /<(script|iframe|object|embed|style|form)\b|\son[a-z]+\s*=|javascript:/i;
    for (const topic of topics) {
      for (const segment of topic.segments) {
        expect(segment.html, topic.id).not.toMatch(unsafe);
      }
    }
  });
});
