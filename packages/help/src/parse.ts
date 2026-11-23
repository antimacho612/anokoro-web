import {
  MAX_YEAR,
  MIN_YEAR,
  clampYear,
  isYear,
  type Source,
  type YearRange,
} from "@anokoro/era-data";
import { Lexer, Parser, type Tokens } from "marked";
import { parse as parseYaml } from "yaml";
import type { HelpSegment, HelpTopic } from "./types.ts";

const FRONT_MATTER = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;
const YEARS_COMMENT = /^<!--\s*years:\s*([\d\s-]+?)\s*-->/;

export class HelpParseError extends Error {
  override name = "HelpParseError";
}

export function parseYearRange(text: string, within: YearRange = [MIN_YEAR, MAX_YEAR]): YearRange {
  const match = /^(\d{4})?\s*(-)?\s*(\d{4})?$/.exec(text.trim());
  if (!match || (match[1] === undefined && match[3] === undefined)) {
    throw new HelpParseError(`年の範囲が読めません: ${text}`);
  }
  const [, fromText, dash, toText] = match;
  const from = fromText === undefined ? MIN_YEAR : Number(fromText);
  const to = toText === undefined ? (dash ? MAX_YEAR : from) : Number(toText);
  if (!isYear(from) || !isYear(to) || from > to) {
    throw new HelpParseError(`年の範囲が正しくありません: ${text}`);
  }
  return intersect([from, to], within);
}

function intersect(a: YearRange, b: YearRange): YearRange {
  return [clampYear(Math.max(a[0], b[0])), clampYear(Math.min(a[1], b[1]))];
}

function yearsCommentOf(text: string): { range: string; comment: string } | undefined {
  const match = YEARS_COMMENT.exec(text.trim());
  return match ? { range: match[1] ?? "", comment: match[0] } : undefined;
}

/**
 * 先頭に年の範囲のコメントがある項目は、Markdown では HTML ブロックとして読まれるため、
 * コメントを外して項目だけを読み直す
 * 出典: CommonMark 0.31.2「4.6 HTML blocks」の開始条件 2 https://spec.commonmark.org/0.31.2/#html-blocks
 */
function relexListItem(item: Tokens.ListItem, comment: string): Tokens.ListItem {
  const rest = item.text.trim().slice(comment.length).trimStart();
  const [token] = new Lexer().lex(`- ${rest.replaceAll("\n", "\n  ")}`);
  const relexed = token?.type === "list" ? (token as Tokens.List).items[0] : undefined;
  if (!relexed) throw new HelpParseError(`リスト項目が読めません: ${item.text}`);
  return { ...relexed, loose: item.loose };
}

export function eraLabel([from, to]: YearRange): string {
  const text =
    to >= MAX_YEAR
      ? `${from}年ごろ〜`
      : from <= MIN_YEAR
        ? `〜${to}年ごろ`
        : `${from}〜${to}年ごろ`;
  return ` <span data-era>${text}</span>`;
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

interface Section {
  depth: number;
  years: YearRange;
}

function bodySegments(body: string, topicYears: YearRange): HelpSegment[] {
  const parser = new Parser();
  const segments: HelpSegment[] = [];
  const sections: Section[] = [];
  let pending: YearRange | undefined;
  const current = (): YearRange => sections.at(-1)?.years ?? topicYears;
  const push = (html: string, years: YearRange): void => {
    const last = segments.at(-1);
    if (last && last.years[0] === years[0] && last.years[1] === years[1]) last.html += html;
    else segments.push({ html, years });
  };

  for (const token of new Lexer().lex(body)) {
    if (token.type === "space") continue;
    const comment = token.type === "html" ? yearsCommentOf(token.raw) : undefined;
    if (comment !== undefined) {
      pending = parseYearRange(comment.range, topicYears);
      continue;
    }
    if (token.type === "heading") {
      const heading = token as Tokens.Heading;
      while ((sections.at(-1)?.depth ?? 0) >= heading.depth) sections.pop();
      const years = pending ? intersect(pending, current()) : current();
      sections.push({ depth: heading.depth, years });
      const label = pending ? eraLabel(pending) : undefined;
      pending = undefined;
      const tokens: Tokens.Generic[] = label
        ? [...heading.tokens, { type: "html", raw: label, text: label, block: false }]
        : heading.tokens;
      push(parser.parse([{ ...heading, tokens }]), years);
      continue;
    }
    if (pending) {
      throw new HelpParseError("年の範囲のコメントは、見出しかリスト項目の先頭に付けます");
    }
    if (token.type === "list") {
      const list = token as Tokens.List;
      const tag = list.ordered ? "ol" : "ul";
      const start =
        list.ordered && list.start !== 1 && list.start !== "" ? ` start="${list.start}"` : "";
      push(`<${tag}${start}>\n`, current());
      for (const item of list.items) {
        const itemComment = yearsCommentOf(item.text);
        if (itemComment === undefined) {
          push(parser.renderer.listitem(item), current());
          continue;
        }
        const years = parseYearRange(itemComment.range, current());
        push(parser.renderer.listitem(relexListItem(item, itemComment.comment)), years);
      }
      push(`</${tag}>\n`, current());
      continue;
    }
    push(parser.parse([token]), current());
  }
  return segments;
}

function sourcesSegment(sources: readonly Source[], years: YearRange): HelpSegment | undefined {
  if (sources.length === 0) return undefined;
  const items = sources
    .map(
      ({ title, url }) =>
        `<li><a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title)}</a></li>\n`,
    )
    .join("");
  return { html: `<h4>参考</h4>\n<ul>\n${items}</ul>\n`, years, reference: true };
}

function readString(data: Record<string, unknown>, key: string, label: string): string {
  const value = data[key];
  if (typeof value !== "string" || value === "") {
    throw new HelpParseError(`${label}: ${key} は空でない文字列にします`);
  }
  return value;
}

function readYears(data: Record<string, unknown>, label: string): YearRange {
  const value = data["years"];
  if (!Array.isArray(value) || value.length !== 2 || !value.every(isYear) || value[0] > value[1]) {
    throw new HelpParseError(`${label}: years は [${MIN_YEAR} 〜 ${MAX_YEAR} の年, 年] にします`);
  }
  return [value[0], value[1]];
}

function readSources(data: Record<string, unknown>, label: string): Source[] {
  const value = data["sources"] ?? [];
  if (!Array.isArray(value)) throw new HelpParseError(`${label}: sources は配列にします`);
  return value.map((entry: unknown) => {
    if (typeof entry !== "object" || entry === null) {
      throw new HelpParseError(`${label}: sources の各項目は title と url を持ちます`);
    }
    const record = entry as Record<string, unknown>;
    const title = readString(record, "title", label);
    const url = readString(record, "url", label);
    if (!/^https?:\/\//.test(url)) throw new HelpParseError(`${label}: url は http(s) にします`);
    return { title, url };
  });
}

export function parseHelpMarkdown(source: string, label = "解説"): HelpTopic<string> {
  const front = FRONT_MATTER.exec(source);
  if (!front) throw new HelpParseError(`${label}: 先頭に frontmatter がありません`);
  const data: unknown = parseYaml(front[1] ?? "");
  if (typeof data !== "object" || data === null) {
    throw new HelpParseError(`${label}: frontmatter が読めません`);
  }
  const record = data as Record<string, unknown>;
  const years = readYears(record, label);
  const sources = readSources(record, label);
  const segments = bodySegments(source.slice(front[0].length), years);
  const references = sourcesSegment(sources, years);
  return {
    id: readString(record, "id", label),
    title: readString(record, "title", label),
    years,
    sources,
    segments: references ? [...segments, references] : segments,
  };
}
