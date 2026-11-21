import { BROKEN_IMAGE, FAKE_BYTES, findAsset, toDataUri } from "@anokoro/assets";
import { FEATURES, featureStatus, type FeatureId, type Year } from "@anokoro/era-data";
import type { AssetRef, Mode, SourceLocation, TopicId, Warning, WarningLevel } from "./types.ts";

/** IE 以外の一部のブラウザだけが先に対応していた期間の警告文 */
export function partialMessage(id: FeatureId): string {
  return `「${FEATURES[id].label}」は一部のブラウザでは使えましたが、主流のIEではまだ使えません`;
}

export const SCHEME_MESSAGE = "javascript: や data: のアドレスはこのキットでは封印中です";

export interface ResolvedAsset {
  /** 書き換え後の URL。空なら属性ごと取り除く */
  url: string;
  fakeBytes: number;
}

/** 1 回の checkEra の状態（警告の集計と素材の一覧） */
export class CheckContext {
  readonly year: Year;
  readonly mode: Mode;
  readonly assets: AssetRef[] = [];
  readonly #source: string;
  readonly #lineStarts: number[];
  readonly #warnings = new Map<string, Warning>();

  constructor(source: string, year: Year, mode: Mode) {
    this.#source = source;
    this.year = year;
    this.mode = mode;
    this.#lineStarts = [0];
    for (let i = 0; i < source.length; i++) {
      if (source.charCodeAt(i) === 10) this.#lineStarts.push(i + 1);
    }
  }

  get source(): string {
    return this.#source;
  }

  warn(
    ruleId: string,
    level: WarningLevel,
    message: string,
    topic: TopicId,
    loc?: SourceLocation,
  ): void {
    const key = `${ruleId}\u0000${message}`;
    let w = this.#warnings.get(key);
    if (w) w.count++;
    else {
      w = { ruleId, level, message, topic, count: 1, locations: [] };
      this.#warnings.set(key, w);
    }
    if (loc) w.locations.push(loc);
  }

  /**
   * 機能年表で判定し、選んだ年に使えなければ警告を出して true を返す。
   * outdatedMessage を渡すと、古い書き方になった年に note を出す（取り除かない）。
   */
  blocked(
    feature: FeatureId,
    ruleId: string,
    message: string,
    topic: TopicId,
    loc?: SourceLocation,
    outdatedMessage?: string,
  ): boolean {
    const status = featureStatus(feature, this.year);
    if (status === "future") {
      this.warn(ruleId, "future", message, topic, loc);
      return true;
    }
    if (status === "partial") {
      // 文言は機能ごとに決まるので、警告も機能の ID でまとめる
      this.warn(feature, "future", partialMessage(feature), topic, loc);
      return true;
    }
    if (status === "outdated" && outdatedMessage !== undefined) {
      this.warn(ruleId, "note", outdatedMessage, topic, loc);
    }
    return false;
  }

  /** 未来の技術を先に、出た順に並べた警告 */
  warnings(): Warning[] {
    const all = [...this.#warnings.values()];
    return [...all.filter((w) => w.level === "future"), ...all.filter((w) => w.level === "note")];
  }

  /** 元のソースの文字位置を行と列にする */
  locationAt(offset: number): SourceLocation {
    let lo = 0;
    let hi = this.#lineStarts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if ((this.#lineStarts[mid] ?? 0) <= offset) lo = mid;
      else hi = mid - 1;
    }
    return { line: lo + 1, col: offset - (this.#lineStarts[lo] ?? 0) + 1 };
  }

  /**
   * ページに書かれた画像のファイル名を素材に解決する。
   * 見つからなければ壊れた画像にして警告する。
   */
  resolveAsset(ref: string, loc?: SourceLocation): ResolvedAsset {
    const name = ref.trim();
    if (name === "") return { url: "", fakeBytes: FAKE_BYTES.missing };
    if (/^data:/i.test(name)) {
      if (/^data:image\//i.test(name)) return { url: name, fakeBytes: FAKE_BYTES.missing };
      this.warn("html.url-scheme", "note", SCHEME_MESSAGE, "js", loc);
      return { url: "", fakeBytes: FAKE_BYTES.missing };
    }
    const asset = findAsset(name);
    if (asset) {
      return {
        url: this.mode === "publish" ? `/assets/${asset.name}` : toDataUri(asset.svg),
        fakeBytes: asset.fakeBytes,
      };
    }
    this.warn(
      "image.missing",
      "note",
      `画像「${name}」が見つかりません（素材集のファイル名を使ってください）`,
      "image",
      loc,
    );
    return { url: toDataUri(BROKEN_IMAGE.svg), fakeBytes: FAKE_BYTES.missing };
  }

  /** 素材を一覧に加え、その添字を返す */
  addAsset(ref: AssetRef): number {
    this.assets.push(ref);
    return this.assets.length - 1;
  }
}
