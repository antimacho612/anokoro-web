export interface TextEdit {
  value: string;
  caret: number;
}

/** 選択範囲を text で置き換え、カーソルを挿入した文字の直後に置く */
export function insertText(value: string, start: number, end: number, text: string): TextEdit {
  const from = Math.max(0, Math.min(start, end, value.length));
  const to = Math.min(value.length, Math.max(start, end));
  return { value: value.slice(0, from) + text + value.slice(to), caret: from + text.length };
}

const encoder = new TextEncoder();

/** UTF-8 でのバイト数 */
export function byteLength(text: string): number {
  return encoder.encode(text).length;
}

/** メモ帳の容量表示。上限の「50MB」は演出 */
export function formatUsage(bytes: number): string {
  return `使用容量 ${(bytes / 1024).toFixed(1)}KB / 50MB`;
}

/** 1 始まりの行と桁を、value の中の位置に直す。範囲外は行末や末尾に寄せる */
export function offsetOf(value: string, line: number, col: number): number {
  let lineStart = 0;
  for (let n = 1; n < line; n++) {
    const newline = value.indexOf("\n", lineStart);
    if (newline === -1) return value.length;
    lineStart = newline + 1;
  }
  const newline = value.indexOf("\n", lineStart);
  const lineEnd = newline === -1 ? value.length : newline;
  return Math.min(lineEnd, lineStart + Math.max(0, col - 1));
}
