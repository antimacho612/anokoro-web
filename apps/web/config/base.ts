/**
 * 公開先のパス（Vite の `base`）を決める。
 * 独自ドメインまでは GitHub Pages の `/<リポジトリ名>/` 配下に置くため、環境変数で切り替える。
 * 前後のスラッシュを補い、未指定や空文字なら `/` を返す。
 */
export function resolveBase(raw: string | undefined): string {
  const trimmed = raw?.trim() ?? "";
  if (trimmed === "" || trimmed === "/") return "/";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
  }
  const inner = trimmed.replace(/^\/+|\/+$/g, "");
  return `/${inner}/`;
}
