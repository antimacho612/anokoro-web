import { FEATURES, type FeatureEntry, type FeatureId } from "./features.ts";
import { SITE_KINDS, siteKindYears, type SiteKindId } from "./site-kinds.ts";
import { TRENDS, type TrendEntry, type TrendId } from "./trends.ts";
import { MAX_YEAR, clampYear, type Source, type YearRange } from "./years.ts";

/**
 * 年の根拠をどの表に頼るか。
 * feature: 機能年表の行 / trend: 流行の行 / siteKind: サイトの種類の行
 */
export type EraRef =
  | { kind: "feature"; feature: FeatureId }
  | { kind: "trend"; trend: TrendId }
  | { kind: "siteKind"; siteKind: SiteKindId };

/** よく使われた年の範囲。機能年表でまだ使えない機能に頼るものは undefined */
export function eraRefYears(ref: EraRef): YearRange | undefined {
  switch (ref.kind) {
    case "feature": {
      const feature: FeatureEntry = FEATURES[ref.feature];
      if (feature.availableFrom === null) return undefined;
      const to =
        feature.outdatedFrom === undefined ? MAX_YEAR : clampYear(feature.outdatedFrom - 1);
      return [feature.availableFrom, to];
    }
    case "trend": {
      const trend: TrendEntry = TRENDS[ref.trend];
      return [trend.from, trend.until ?? MAX_YEAR];
    }
    case "siteKind":
      return siteKindYears(ref.siteKind);
    default: {
      const _exhaustive: never = ref;
      return _exhaustive;
    }
  }
}

export function eraRefSources(ref: EraRef): readonly Source[] {
  switch (ref.kind) {
    case "feature":
      return FEATURES[ref.feature].sources;
    case "trend":
      return TRENDS[ref.trend].sources;
    case "siteKind":
      return SITE_KINDS[ref.siteKind].sources;
    default: {
      const _exhaustive: never = ref;
      return _exhaustive;
    }
  }
}
