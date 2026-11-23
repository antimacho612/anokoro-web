import type { YearRange } from "@anokoro/era-data";
import { describe, expect, test } from "vite-plus/test";
import { resolveTopic, topicHtml, topicsForYear, type HelpTopic } from "./index.ts";

const topic = (id: HelpTopic["id"], years: YearRange): HelpTopic => ({
  id,
  title: id,
  years,
  sources: [],
  segments: [
    { html: "<p>いつでも</p>", years: [1995, 2015] },
    { html: "<p>2004年から</p>", years: [2004, 2015] },
  ],
});

const topics = [
  topic("line", [1995, 2015]),
  topic("css", [1995, 2015]),
  topic("timeline", [1999, 2015]),
];

describe("topicsForYear", () => {
  test("範囲外の年のトピックは出さない", () => {
    expect(topicsForYear(topics, 1998).map((t) => t.id)).toEqual(["line", "css"]);
    expect(topicsForYear(topics, 1999).map((t) => t.id)).toEqual(["line", "css", "timeline"]);
  });
});

test("その年に本文がないトピックは、参考があっても出さない", () => {
  const ended: HelpTopic = {
    id: "screen",
    title: "画面と色",
    years: [1995, 2015],
    sources: [{ title: "出典", url: "https://example.com/" }],
    segments: [
      { html: "<p>2003年まで</p>", years: [1995, 2003] },
      { html: "<h4>参考</h4>", years: [1995, 2015], reference: true },
    ],
  };
  expect(topicsForYear([ended], 2003)).toHaveLength(1);
  expect(topicsForYear([ended], 2004)).toHaveLength(0);
});

describe("resolveTopic", () => {
  test("開きたいトピックを出せればそれを返す", () => {
    expect(resolveTopic(topics, 2003, "css")?.id).toBe("css");
  });

  test("開いていなければ年表を返す", () => {
    expect(resolveTopic(topics, 2003, null)?.id).toBe("timeline");
  });

  test("年表も出せない年は最初のトピックを返す", () => {
    expect(resolveTopic(topics, 1996, "timeline")?.id).toBe("line");
  });
});

describe("topicHtml", () => {
  test("選んだ年より後の内容は出さない", () => {
    expect(topicHtml(topics[0] as HelpTopic, 2003)).toBe("<p>いつでも</p>");
    expect(topicHtml(topics[0] as HelpTopic, 2004)).toBe("<p>いつでも</p><p>2004年から</p>");
  });
});
