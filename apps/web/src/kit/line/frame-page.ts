import type { AssetRef } from "@anokoro/era-checker";

/** 回線経由表示で、読み込みの進み具合を疑似ブラウザの文書に反映する口 */
export interface NetPage {
  open(): void;
  write(html: string): void;
  close(): void;
  assetStart(index: number, asset: AssetRef): void;
  assetProgress(index: number, asset: AssetRef, fraction: number): void;
  assetDone(index: number, asset: AssetRef): void;
}

/** 回線経由表示の直前に iframe へ入れる白紙の文書 */
export const BLANK_PAGE = "<!DOCTYPE html><html><head></head><body></body></html>";

const MARK: Record<AssetRef["kind"], string> = {
  img: "data-anokoro-img",
  background: "data-anokoro-bg",
  counter: "data-anokoro-ctr",
  bgm: "data-anokoro-bgm",
};

function clipFromBottom(fraction: number): string {
  return `inset(0 0 ${Math.max(0, 100 - fraction * 100).toFixed(1)}% 0)`;
}

/** sandbox="allow-same-origin" の iframe の文書に、親から書き込む */
export function createFramePage(doc: Document): NetPage {
  const find = (index: number, asset: AssetRef): HTMLElement | null =>
    doc.querySelector<HTMLElement>(`[${MARK[asset.kind]}="${index}"]`);

  return {
    open: () => void doc.open(),
    write: (html) => doc.write(html),
    close: () => doc.close(),
    assetStart(index, asset) {
      const el = find(index, asset);
      if (!el || asset.kind !== "img") return;
      el.style.setProperty("clip-path", clipFromBottom(0));
      el.setAttribute("src", asset.resolved);
    },
    assetProgress(index, asset, fraction) {
      const el = find(index, asset);
      if (!el || asset.kind !== "img") return;
      el.style.setProperty("clip-path", clipFromBottom(fraction));
    },
    assetDone(index, asset) {
      const el = find(index, asset);
      if (!el) return;
      switch (asset.kind) {
        case "img":
          el.style.removeProperty("clip-path");
          el.removeAttribute(MARK.img);
          if (!el.getAttribute("style")) el.removeAttribute("style");
          break;
        case "background":
          el.setAttribute("background", asset.resolved);
          break;
        case "counter":
        case "bgm":
          el.textContent = asset.resolved;
          break;
      }
    },
  };
}

/**
 * 疑似ブラウザの iframe を受け取り、次に作られた iframe の読み込み完了を待てるようにする。
 * React の ref コールバックに attach を渡す。
 */
export class FrameSlot {
  #attached = 0;
  #waiters: { after: number; resolve: (doc: Document | null) => void }[] = [];

  readonly attach = (el: HTMLIFrameElement | null): void => {
    if (!el) return;
    const index = ++this.#attached;
    el.addEventListener(
      "load",
      () => {
        const ready = this.#waiters.filter((w) => w.after < index);
        this.#waiters = this.#waiters.filter((w) => w.after >= index);
        for (const w of ready) w.resolve(el.contentDocument);
      },
      { once: true },
    );
  };

  /** この呼び出しより後に attach された iframe が読み込まれたら、その文書で解決する */
  next(): Promise<Document | null> {
    return new Promise((resolve) => this.#waiters.push({ after: this.#attached, resolve }));
  }
}
