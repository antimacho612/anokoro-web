import { describe, expect, it } from "vite-plus/test";
import { FrameSlot, type LoadableFrame } from "./frame-page.ts";

function fakeFrame(doc: Document) {
  let onLoad: (() => void) | null = null;
  const frame: LoadableFrame = {
    contentDocument: doc,
    addEventListener: (_type, listener) => void (onLoad = listener),
  };
  return { frame, load: () => onLoad?.() };
}

const docA = { title: "a" } as Document;
const docB = { title: "b" } as Document;

describe("FrameSlot", () => {
  it("nextLoadedDocument を呼んだ後に attach された iframe の読み込みを待つ", async () => {
    const slot = new FrameSlot();
    const old = fakeFrame(docA);
    slot.attach(old.frame);
    const next = slot.nextLoadedDocument();

    old.load();
    const fresh = fakeFrame(docB);
    slot.attach(fresh.frame);
    fresh.load();

    await expect(next).resolves.toBe(docB);
  });

  it("新しい iframe が読み込まれるまでは解決しない", async () => {
    const slot = new FrameSlot();
    const next = slot.nextLoadedDocument();
    const fresh = fakeFrame(docA);
    slot.attach(fresh.frame);

    const settled = await Promise.race([next.then(() => true), Promise.resolve(false)]);
    expect(settled).toBe(false);
    fresh.load();
    await expect(next).resolves.toBe(docA);
  });
});
