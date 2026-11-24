# あのころ Web

1995 〜 2015 年の日本の Web を、年を切り替えながら「ページ作り」と「回線環境」ごと追体験できる Web サービス。

## 禁止事項

- ユーザーが書いた JavaScript を実行しない。プレビューの iframe は `sandbox="allow-same-origin"` のみで、`allow-scripts` と `allow-forms` を付けない
- 実在の製品やサービスのロゴ、アイコン、名称、デザイン、起動音を使わない。架空名（ネットサーファー、ほげスペース、ほげほげ）だけを使う
  - 例外として、作成キットの外観は年ごとの OS の雰囲気（配色、角の丸み、枠、ボタンの形、フォント）に寄せてよい。ロゴ、スタートボタン、製品名、壁紙、アイコン画像は使わない
- 録音素材や第三者の画像を入れない。素材は自作 SVG か CC0 で、`packages/assets` のマニフェストに作者とライセンスを書く
- クライアントでのサニタイズ結果を信用しない。公開版の HTML は必ずサーバーで `checkEra` を通して作る
- URLやファイルで受け取ったサイトは悪意ある入力として扱う。展開後 2MB で打ち切り、Zod で検証し、`checkEra` を通してから表示する

## 設計上の約束

- `packages/era-checker` は純粋関数。ネットワーク、時刻、DOM（ブラウザ専用API）を使わない。HTML は `parse5`、CSS は `css-tree` で解析する（正規表現で CSS を処理しない）
- `packages/netsim` は DOM に依存しない。時計は差し替え可能にし、テストを決定的にする
- 接続音の乱数はシード付きにする
- 年に依存するルール（タグ、属性、CSS、回線、解像度）はコードに直書きせず、`packages/era-data` のデータとして持つ。各行に根拠の URL を書く
- 警告と解説トピックの対応は、ルール定義の `topic` で持つ（文言マッチングはしない）
- 音はユーザーの操作をきっかけにしてだけ鳴らす。点滅は `prefers-reduced-motion` で抑える
- 実行時に同梱する依存は、MIT、ISC、BSD、Apache-2.0 など、表記だけで使えるライセンスに限る。表記は `apps/web/config/third-party-licenses.ts` がビルド時にバンドルから集めて `third-party-licenses.txt` に出すので、手で一覧を書かない
- `localStorage` のキーは `anokoro:` で始め、読み書きは try/catch で囲む
- UI の文言はすべて日本語
- `apps/web/src` は Feature-Sliced Design（app / pages / widgets / features / entities / shared）で置く。import は下の層へだけ向け、スライスの外からは `index.ts` を通す。entity 同士は `@x` を使う

## コマンド（Vite+）

開発ツールは Vite+ の `vp` コマンドに統一する。
`.oxlintrc.json` や `vitest.config.ts` などの個別設定ファイルは作らず、各パッケージの `vite.config.ts` にまとめる。

```sh
vp install   # 依存の導入（pnpm workspaces）
vp dev       # 開発サーバー
vp check     # 整形、Lint、型チェック
vp test      # 単体テストとゴールデンテスト
vp build     # 本番ビルド
```

- E2E は Playwright、D1 のマイグレーションは Wrangler（どちらも Vite+ には含まれない）
- 変更を完了とする前に `vp check`、`vp test`、`vp run -r fsd` を通す
- E2E は `apps/web` で `vp exec playwright test` を実行する。Playwright だけは個別の設定ファイル（`apps/web/playwright.config.ts`）を置く
- FSD の層の検査は Steiger（`vp run -r fsd`）。oxlint では import の指定文字列でしか層を判定できないため、Steiger だけは個別の設定ファイル（`apps/web/steiger.config.ts`）を置く
  - `fsd/insignificant-slice` は切る。作成キットの窓（widgets）は `pages/kit` からしか使わないが、ページに統合すると大きくなりすぎるため
  - `shared/styles` は CSS だけなので `fsd/public-api` を切る

## Lint で検査しないと決めたもの

- TODO と FIXME の検出（`eslint/no-warning-comments`）は入れない。チケット番号付きの TODO を許す区別ができず、一律に禁止することになるため
- コメントアウトされたコードの検出（`sonarjs/no-commented-code`）は入れない。oxlint の JS プラグインではこのルールが検出せず、oxc の適合性テスト（`apps/oxlint/conformance/snapshots/sonarjs.md`）でも 18 件中 14 件が失敗しているため
- `oxlint-disable` の理由の必須化は検査できない。`eslint-comments/require-description` は `eslint-disable` のコメントだけを対象にするため、抑制には `eslint-disable` の形で理由を書く
- マジックナンバーの検出（`eslint/no-magic-numbers`）は入れない。年代データの年、見本サイトやパーツの寸法など、そのまま書くのが正しい数値が多く、除外の設定を保守しきれないため
