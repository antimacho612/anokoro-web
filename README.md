# あのころ Web

🚧 開発中

1995 〜 2015 年の日本の Web を追体験できる Web サービス。
選んだ年の制約の中でメモ帳に HTML を手打ちして個人サイトを作り、その年の回線（ダイヤルアップから ADSL、光まで）で、画像が上から少しずつ表示される読み込みを体験できる。

## 開発

Node.js 24 と pnpm は `package.json` の `devEngines` で固定している。ツールは Vite+ の `vp` コマンドにまとめている。

```sh
vp install            # 依存の導入
vp dev                # 開発サーバー（apps/web で実行。/kit/ と /view/）
vp check              # 整形、Lint、型チェック
vp test               # 単体テスト
vp run -r build       # 本番ビルド
vp run ci             # check、test、build を順に実行
```

公開先のパス（Vite の `base`）は環境変数 `ANOKORO_BASE` で切り替える（既定は `/`）。

```sh
ANOKORO_BASE=/anokoro-web/ vp run -r build
```

## ライセンス

| 対象                                     | ライセンス                                    |
| ---------------------------------------- | --------------------------------------------- |
| プログラム（下記以外のすべて）           | [MIT License](LICENSE)                        |
| 文章（`content/`）                       | [CC BY 4.0](content/LICENSE.md)               |
| 素材の SVG（`packages/assets/src/svg/`） | [CC0 1.0](packages/assets/src/svg/LICENSE.md) |

「ネットサーファー」「ほげスペース」「ほげほげ」は架空の名前で、実在の製品やサービスとは関係ありません。

本番ビルドには、同梱したサードパーティ製パッケージのライセンス表記を `third-party-licenses.txt` として出力し、サイトの「このサイトについて」からリンクする。
