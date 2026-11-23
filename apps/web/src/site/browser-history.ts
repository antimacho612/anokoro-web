/** 疑似ブラウザの履歴の 1 件。サイトのページか、見つからなかった URL */
export type HistoryEntry = { kind: "page"; path: string } | { kind: "missing"; url: string };

export interface BrowserHistory {
  entries: readonly HistoryEntry[];
  index: number;
}

export function startHistory(entry: HistoryEntry): BrowserHistory {
  return { entries: [entry], index: 0 };
}

export function currentEntry(history: BrowserHistory): HistoryEntry | undefined {
  return history.entries[history.index];
}

function entryKey(entry: HistoryEntry): string {
  return entry.kind === "page" ? `page:${entry.path}` : `missing:${entry.url}`;
}

/** 新しく開いた場所を積む。進む側の履歴は捨てる。今と同じ場所なら積まない */
export function pushHistory(history: BrowserHistory, entry: HistoryEntry): BrowserHistory {
  const current = currentEntry(history);
  if (current && entryKey(current) === entryKey(entry)) return history;
  const entries = [...history.entries.slice(0, history.index + 1), entry];
  return { entries, index: entries.length - 1 };
}

export function canGoBack(history: BrowserHistory): boolean {
  return history.index > 0;
}

export function canGoForward(history: BrowserHistory): boolean {
  return history.index < history.entries.length - 1;
}

export function goBack(history: BrowserHistory): BrowserHistory {
  return canGoBack(history) ? { ...history, index: history.index - 1 } : history;
}

export function goForward(history: BrowserHistory): BrowserHistory {
  return canGoForward(history) ? { ...history, index: history.index + 1 } : history;
}

/** ページの名前が変わったとき、履歴の中の古い名前を置き換える */
export function renameInHistory(history: BrowserHistory, from: string, to: string): BrowserHistory {
  return {
    ...history,
    entries: history.entries.map((e) =>
      e.kind === "page" && e.path === from ? { kind: "page", path: to } : e,
    ),
  };
}
