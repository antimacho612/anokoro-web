import type { Resolution } from "@anokoro/era-data";

/** 解像度から引く、ブラウザの枠とタスクバーの高さ */
export const BROWSER_CHROME_HEIGHT = 150;
/** 表示領域の上に出す広告帯の高さ */
export const AD_BAR_HEIGHT = 46;

export interface StageLayout {
  /** 縮小前の表示領域の幅と高さ（広告帯を含む） */
  stageWidth: number;
  stageHeight: number;
  /** ページを描く iframe の高さ */
  frameHeight: number;
  /** 縮小率。拡大はしない */
  scale: number;
  /** 縮小した表示領域を中央に寄せるための左の余白 */
  left: number;
  /** 縮小後の表示領域の高さ */
  viewportHeight: number;
}

/** 選んだ解像度の表示領域を、使える幅に収まるように縮小する */
export function stageLayout({ width, height }: Resolution, availableWidth: number): StageLayout {
  const stageHeight = height - BROWSER_CHROME_HEIGHT;
  const scale = availableWidth > 0 ? Math.min(1, availableWidth / width) : 1;
  return {
    stageWidth: width,
    stageHeight,
    frameHeight: stageHeight - AD_BAR_HEIGHT,
    scale,
    left: Math.max(0, (availableWidth - width * scale) / 2),
    viewportHeight: Math.ceil(stageHeight * scale),
  };
}
