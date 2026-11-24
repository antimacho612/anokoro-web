import { INDEX_PAGE } from "../model/site-model.ts";

/** 疑似ブラウザの中でリンクを押したときの行き先 */
export type LinkTarget =
  /** サイトの中のページ */
  | { kind: "page"; path: string }
  /** サイトの中だが、そのページがない */
  | { kind: "missing"; url: string }
  /** サイトの外。疑似ブラウザでは開けない */
  | { kind: "external"; url: string }
  /** 同じページの中の移動 */
  | { kind: "hash" }
  | { kind: "mailto" }
  | { kind: "none" };

/** 相対 URL を解決するための仮の基準。サイトの中かどうかの判定だけに使う */
const BASE_ORIGIN = "http://site.invalid";

export interface ResolveLinkInput {
  href: string;
  currentPath: string;
  hasPage: (path: string) => boolean;
  /** 疑似 URL のサイトの置き場所（末尾は /） */
  siteRoot: string;
}

export function resolveLink({
  href,
  currentPath,
  hasPage,
  siteRoot,
}: ResolveLinkInput): LinkTarget {
  const trimmed = href.trim();
  if (trimmed === "") return { kind: "none" };
  if (trimmed.startsWith("#")) return { kind: "hash" };
  const scheme = /^([a-z][a-z0-9+.-]*):/i.exec(trimmed)?.[1]?.toLowerCase();
  if (scheme === "mailto") return { kind: "mailto" };
  if (scheme === "http" || scheme === "https" || scheme === "ftp" || trimmed.startsWith("//")) {
    return { kind: "external", url: trimmed };
  }
  if (scheme !== undefined) return { kind: "none" };

  let url: URL;
  try {
    url = new URL(trimmed, `${BASE_ORIGIN}/${currentPath}`);
  } catch {
    return { kind: "none" };
  }
  const rest = url.pathname.replace(/^\//, "");
  const path = rest === "" ? INDEX_PAGE : decodeURIComponent(rest).toLowerCase();
  if (hasPage(path)) return { kind: "page", path };
  return { kind: "missing", url: `${siteRoot}${rest}` };
}
