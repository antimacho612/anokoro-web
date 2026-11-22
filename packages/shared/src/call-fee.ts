/** 市内通話の料金単位。3 分ごとに 10 円 */
export const FEE_YEN_PER_UNIT = 10;
export const FEE_UNIT_SEC = 180;

/** 接続時間（秒）に対する通話料（円）。つないだ時点で最低 1 単位かかる */
export function callFee(elapsedSec: number): number {
  return FEE_YEN_PER_UNIT * Math.max(1, Math.ceil(elapsedSec / FEE_UNIT_SEC));
}

/** テレホーダイの定額時間帯は 23 時から翌 8 時 */
export function isTelehoTime(date: Date): boolean {
  const hour = date.getHours();
  return hour >= 23 || hour < 8;
}

/** 秒を hh:mm:ss にする */
export function formatHms(totalSec: number): string {
  const sec = Math.max(0, Math.floor(totalSec));
  return [Math.floor(sec / 3600), Math.floor(sec / 60) % 60, sec % 60]
    .map((n) => String(n).padStart(2, "0"))
    .join(":");
}
