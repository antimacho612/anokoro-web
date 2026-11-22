import type { LineEntry } from "@anokoro/era-data";
import { callFee, formatHms, isTelehoTime } from "@anokoro/shared";
import type { Connection, LastLoad } from "../store.ts";
import { formatSeconds } from "./net-controller.ts";

export function connectionText(line: LineEntry, connection: Connection): string {
  if (line.dial === "always") return `常時接続（${line.name}）`;
  if (connection === "dialing") return "接続しています...";
  if (connection === "online") return `接続中 ${line.connectedLabel ?? ""}`;
  return "未接続";
}

/** 通話料の表示。now は利用者の端末の時刻 */
export function feeText(line: LineEntry, connectedAt: number | null, now: Date): string {
  if (line.dial === "always") return "定額制なのでつなぎっぱなしでOK";
  const teleho = isTelehoTime(now);
  if (connectedAt === null) {
    return teleho
      ? "いまはテレホーダイの時間帯（23時〜翌8時は定額）"
      : "通話料：3分ごとに10円かかります";
  }
  const sec = Math.max(0, Math.floor((now.getTime() - connectedAt) / 1000));
  return `接続時間 ${formatHms(sec)}　${teleho ? "テレホーダイ適用中（定額）" : `通話料 約${callFee(sec)}円`}`;
}

export function lastLoadText({ elapsedMs, totalBytes, lineName }: LastLoad): string {
  return `前回の読み込み：${formatSeconds(elapsedMs)}秒／${(totalBytes / 1024).toFixed(1)}KB（${lineName}）`;
}
