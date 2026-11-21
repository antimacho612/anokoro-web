# あのころ Web（anokoro-web）

1995 〜 2012 年の日本の Web を、年を切り替えながら「ページ作り」と「回線環境」ごと追体験できる Web サービス。

## 禁止事項

- ユーザーが書いた JavaScript を実行しない。プレビューの iframe は `sandbox="allow-same-origin"` のみで、`allow-scripts` と `allow-forms` を付けない
- 実在の製品やサービスのロゴ、アイコン、名称、デザイン、起動音を使わない。架空名（ネットサーファー、ほげスペース、ほげほげ）だけを使う
- 録音素材や第三者の画像を入れない。素材は自作SVGかCC0で、`packages/assets` のマニフェストに作者とライセンスを書く
- クライアントでのサニタイズ結果を信用しない。公開版のHTMLは必ずサーバーで `checkEra` を通して作る
- URLやファイルで受け取ったサイトは悪意ある入力として扱う。展開後2MBで打ち切り、Zodで検証し、`checkEra` を通してから表示する

## 設計上の約束

- `packages/era-checker` は純粋関数。ネットワーク、時刻、DOM（ブラウザ専用API）を使わない。HTMLは `parse5`、CSSは `css-tree` で解析する（正規表現で CSS を処理しない）
- `packages/netsim` はDOMに依存しない。時計は差し替え可能にし、テストを決定的にする
- 接続音の乱数はシード付きにする
- 年に依存するルール（タグ、属性、CSS、回線、解像度）はコードに直書きせず、`packages/era-data` のデータとして持つ。各行に根拠のURLを書く
- 警告と解説トピックの対応は、ルール定義の `topic` で持つ（文言マッチングはしない）
- 音はユーザーの操作をきっかけにしてだけ鳴らす。点滅は `prefers-reduced-motion` で抑える
- `localStorage` のキーは `anokoro:` で始め、読み書きは try/catch で囲む
- UIの文言はすべて日本語

## コマンド（Vite+）

開発ツールは Vite+ の `vp` コマンドに統一する。`.oxlintrc.json` や `vitest.config.ts` などの個別設定ファイルは作らず、各パッケージの `vite.config.ts` にまとめる。

```sh
vp install   # 依存の導入（pnpm workspaces）
vp dev       # 開発サーバー
vp check     # 整形、Lint、型チェック
vp test      # 単体テストとゴールデンテスト
vp build     # 本番ビルド
```

- E2E は Playwright、D1 のマイグレーションは Wrangler（どちらも Vite+ には含まれない）
- 変更を完了とする前に `vp check` と `vp test` を通す
