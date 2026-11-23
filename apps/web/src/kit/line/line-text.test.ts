import { getLine } from "@anokoro/era-data";
import { describe, expect, it } from "vite-plus/test";
import { connectionText, feeText, lastLoadText } from "./line-text.ts";

const noon = new Date(2003, 10, 18, 12, 0, 0);
const midnight = new Date(2003, 10, 18, 23, 30, 0);

describe("feeText", () => {
  it("常時接続は定額", () => {
    expect(feeText(getLine("adsl1"), null, noon)).toBe("定額制なのでつなぎっぱなしでOK");
  });

  it("未接続では料金の仕組みを出す", () => {
    expect(feeText(getLine("m56"), null, noon)).toBe("当時の通話料：3分ごとに10円");
    expect(feeText(getLine("m56"), null, midnight)).toBe(
      "いまはテレホーダイの時間帯（23時〜翌8時は定額）",
    );
  });

  it("接続中は接続時間と当時の通話料を出し、テレホーダイの時間帯は金額を出さない", () => {
    const since = (date: Date, sec: number) => date.getTime() - sec * 1000;
    expect(feeText(getLine("m56"), since(noon, 181), noon)).toBe(
      "接続時間 00:03:01　当時なら通話料 約20円",
    );
    expect(feeText(getLine("isdn"), since(midnight, 3600), midnight)).toBe(
      "接続時間 01:00:00　テレホーダイ適用中（定額）",
    );
  });
});

describe("connectionText", () => {
  it("回線と状態に合わせた文言", () => {
    expect(connectionText(getLine("hikari"), "offline")).toBe("常時接続（光ファイバー 100M）");
    expect(connectionText(getLine("m56"), "offline")).toBe("未接続");
    expect(connectionText(getLine("m56"), "dialing")).toBe("接続しています...");
    expect(connectionText(getLine("m56"), "online")).toBe("接続中 53.3Kbps");
  });
});

describe("lastLoadText", () => {
  it("秒数、合計バイト数、回線名", () => {
    expect(lastLoadText({ elapsedMs: 12345, totalBytes: 30720, lineName: "56kモデム" })).toBe(
      "前回の読み込み：12.3秒／30.0KB（56kモデム）",
    );
  });
});
