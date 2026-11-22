import type { AssetRef } from "@anokoro/era-checker";

export interface NetFrameWriter {
  open(): void;
  write(html: string): void;
  close(): void;
  assetStart(index: number, asset: AssetRef): void;
  assetProgress(index: number, asset: AssetRef, fraction: number): void;
  assetDone(index: number, asset: AssetRef): void;
}

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

export function createNetFrameWriter(doc: Document): NetFrameWriter {
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

export interface LoadableFrame {
  readonly contentDocument: Document | null;
  addEventListener(type: "load", listener: () => void, options: { once: true }): void;
}

export class FrameSlot {
  #attached = 0;
  #waiters: { after: number; resolve: (doc: Document | null) => void }[] = [];

  readonly attach = (el: LoadableFrame | null): void => {
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

  nextLoadedDocument(): Promise<Document | null> {
    return new Promise((resolve) => this.#waiters.push({ after: this.#attached, resolve }));
  }
}
