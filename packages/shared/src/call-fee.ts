export const LOCAL_CALL_YEN_PER_UNIT = 10;
export const LOCAL_CALL_UNIT_SEC = 180;

// テレホーダイの定額時間帯（出典: https://ja.wikipedia.org/wiki/テレホーダイ）
export const TELEHO_START_HOUR = 23;
export const TELEHO_END_HOUR = 8;

/** 接続時間（秒）に対する通話料（円）。つないだ時点で最低 1 単位かかる */
export function callFee(elapsedSec: number): number {
  return LOCAL_CALL_YEN_PER_UNIT * Math.max(1, Math.ceil(elapsedSec / LOCAL_CALL_UNIT_SEC));
}

export function isTelehoTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= TELEHO_START_HOUR || hour < TELEHO_END_HOUR;
}

export function formatHms(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec));
  return [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
