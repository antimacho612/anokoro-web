import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { Plugin } from "vite-plus";

/** ビルドに出力する、同梱したサードパーティ製パッケージのライセンス表記のファイル名 */
export const THIRD_PARTY_LICENSES_FILE = "third-party-licenses.txt";

export interface PackageNotice {
  name: string;
  version: string;
  /** package.json の license（SPDX 式） */
  license: string;
  /** パッケージに同梱された LICENSE ファイルの本文。ないときは null */
  text: string | null;
}

const LICENSE_FILE = /^licen[cs]e(?:[.-].*)?$/i;

/** モジュールの ID が node_modules 内のファイルなら、そのファイルのパスを返す */
function nodeModulesPath(id: string): string | null {
  const path = id
    .replace(/^\0/, "")
    .replace(/[?#].*$/, "")
    .replaceAll("\\", "/");
  return path.includes("/node_modules/") ? path : null;
}

/** ファイルから上へたどり、name と version を持つ package.json のある場所を返す */
function findPackageRoot(file: string): string | null {
  for (let dir = dirname(file); dir.includes("/node_modules/"); dir = dirname(dir)) {
    const manifest = join(dir, "package.json");
    if (!existsSync(manifest)) continue;
    const pkg = JSON.parse(readFileSync(manifest, "utf8")) as { name?: unknown; version?: unknown };
    if (typeof pkg.name === "string" && typeof pkg.version === "string") return dir;
  }
  return null;
}

/** パッケージのディレクトリから、ライセンスの情報を読む */
export function readPackageNotice(root: string): PackageNotice {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8")) as {
    name: string;
    version: string;
    license?: unknown;
  };
  const licenseFile = readdirSync(root).find((file) => LICENSE_FILE.test(file));
  return {
    name: pkg.name,
    version: pkg.version,
    license: typeof pkg.license === "string" ? pkg.license : "UNKNOWN",
    text: licenseFile ? readFileSync(join(root, licenseFile), "utf8").trim() : null,
  };
}

/** バンドルに含まれたモジュールの ID から、同梱したパッケージのライセンス情報を集める */
export function collectNotices(moduleIds: Iterable<string>): PackageNotice[] {
  const roots = new Set<string>();
  for (const id of moduleIds) {
    const path = nodeModulesPath(id);
    const root = path && findPackageRoot(path);
    if (root) roots.add(root);
  }
  const notices = new Map<string, PackageNotice>();
  for (const root of roots) {
    const notice = readPackageNotice(root);
    notices.set(`${notice.name}@${notice.version}`, notice);
  }
  return [...notices.values()].toSorted(
    (a, b) => a.name.localeCompare(b.name, "en") || a.version.localeCompare(b.version, "en"),
  );
}

/** ライセンス表記のテキストを組み立てる */
export function formatNotices(notices: readonly PackageNotice[]): string {
  const header = [
    "あのころ Web が同梱しているサードパーティ製ソフトウェアのライセンス表記",
    "Third-party software notices for anokoro-web",
    "",
    "あのころ Web 自体のライセンスは https://github.com/antimacho612/anokoro-web を参照してください。",
  ].join("\n");
  const sections = notices.map((notice) =>
    [
      `${notice.name}@${notice.version}`,
      `License: ${notice.license}`,
      "",
      notice.text ?? "(LICENSE ファイルが同梱されていません)",
    ].join("\n"),
  );
  return `${[header, ...sections].join(`\n\n${"-".repeat(72)}\n\n`)}\n`;
}

/**
 * 本番ビルドで、バンドルに入った node_modules のパッケージのライセンス表記を
 * `third-party-licenses.txt` として出力する。MIT などの「著作権表示と許諾表示を
 * 複製物に含める」条件を満たすため
 */
export function thirdPartyLicenses(): Plugin {
  return {
    name: "anokoro:third-party-licenses",
    configureServer(server) {
      // 開発サーバーではバンドルを作らないため、リンク切れにせず生成のタイミングだけ伝える
      const path = `${server.config.base}${THIRD_PARTY_LICENSES_FILE}`;
      server.middlewares.use((req, res, next) => {
        if (req.url?.split("?")[0] !== path) return next();
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
        res.end("ライセンス表記の一覧は本番ビルド（vp build）で生成します。\n");
      });
    },
    generateBundle(_options, bundle) {
      const moduleIds = Object.values(bundle).flatMap((output) =>
        output.type === "chunk" ? output.moduleIds : [],
      );
      this.emitFile({
        type: "asset",
        fileName: THIRD_PARTY_LICENSES_FILE,
        source: formatNotices(collectNotices(moduleIds)),
      });
    },
  };
}
