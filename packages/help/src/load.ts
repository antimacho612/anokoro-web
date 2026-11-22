import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { HelpParseError, parseHelpMarkdown } from "./parse.ts";
import type { HelpTopic } from "./types.ts";

export interface LoadedHelp {
  topics: HelpTopic<string>[];
  files: string[];
}

export function loadHelpTopics(dir: string): LoadedHelp {
  const files = readdirSync(dir)
    .filter((name) => name.endsWith(".md"))
    .sort()
    .map((name) => join(dir, name));
  const topics = files.map((file) => parseHelpMarkdown(readFileSync(file, "utf8"), file));
  const seen = new Set<string>();
  for (const { id } of topics) {
    if (seen.has(id)) throw new HelpParseError(`解説の id が重複しています: ${id}`);
    seen.add(id);
  }
  return { topics, files };
}
