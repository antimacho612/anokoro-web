import { describe, expect, it } from "vite-plus/test";
import { stageLayout } from "./stage-layout.ts";

describe("stageLayout", () => {
  it("表示領域は解像度の高さから 150px、iframe はさらに広告帯の 46px を引く", () => {
    const layout = stageLayout({ width: 800, height: 600 }, 800);
    expect(layout).toMatchObject({ stageWidth: 800, stageHeight: 450, frameHeight: 404 });
  });

  it("幅が足りなければ縮小し、縮小後の高さを返す", () => {
    const layout = stageLayout({ width: 800, height: 600 }, 400);
    expect(layout.scale).toBe(0.5);
    expect(layout.viewportHeight).toBe(225);
    expect(layout.left).toBe(0);
  });

  it("幅が余っても拡大せず、中央に寄せる", () => {
    const layout = stageLayout({ width: 640, height: 480 }, 840);
    expect(layout.scale).toBe(1);
    expect(layout.left).toBe(100);
    expect(layout.viewportHeight).toBe(330);
  });
});
