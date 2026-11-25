import { ASSETS, BROKEN_IMAGE, PENDING_IMAGE, SITE_ICON, type AssetRights } from "@anokoro/assets";
import { REPOSITORY_URL } from "../../../shared/config/index.ts";

const THIRD_PARTY_LICENSES_URL = `${import.meta.env.BASE_URL}third-party-licenses.txt`;

const SYSTEM_IMAGES: readonly (AssetRights & { name: string })[] = [
  { name: "壊れた画像のアイコン", ...BROKEN_IMAGE },
  { name: "読み込み中の付箋", ...PENDING_IMAGE },
  { name: "サイトのアイコン", ...SITE_ICON },
];

export function AboutContent() {
  const rows = [...ASSETS, ...SYSTEM_IMAGES];
  return (
    <>
      <h3>このサイトについて</h3>
      <p>
        「あのころ Web」は、1995年から2015年までの日本の Web
        を、ページ作りと回線環境ごと追体験するためのサイトです。
      </p>

      <h4>名前について</h4>
      <p>
        ブラウザ「ネットサーファー」、ホスティング「ほげスペース」、ポータル「ほげほげ」は架空の名前です。実在の製品やサービスとは関係ありません。
      </p>
      <p>
        画面の右上にある GitHub のマークは GitHub, Inc.
        の商標で、このサイトのソースコードへのリンクとしてだけ使っています。
      </p>

      <h4>素材</h4>
      <p>素材はすべて自作か、CC0 で公開されているものです。</p>
      <table>
        <thead>
          <tr>
            <th scope="col">素材</th>
            <th scope="col">作者</th>
            <th scope="col">ライセンス</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name}>
              <td>{row.name}</td>
              <td>{row.author}</td>
              <td>{row.license}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h4>ライセンス</h4>
      <ul>
        <li>
          プログラム：
          <a href={`${REPOSITORY_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
            MIT License
          </a>
        </li>
        <li>
          解説などの文章：
          <a
            href="https://creativecommons.org/licenses/by/4.0/deed.ja"
            target="_blank"
            rel="noopener noreferrer"
          >
            クリエイティブ・コモンズ 表示 4.0 国際（CC BY 4.0）
          </a>
        </li>
        <li>素材：CC0-1.0（上の表のとおり）</li>
      </ul>
      <p>© 2026 antimacho612</p>

      <h4>使っているオープンソースソフトウェア</h4>
      <p>
        画面やHTMLの解析には React、parse5、css-tree
        などのオープンソースソフトウェアを使っています。各ソフトウェアの著作権表示とライセンス条文は
        <a href={THIRD_PARTY_LICENSES_URL} target="_blank" rel="noopener noreferrer">
          ライセンス表記の一覧
        </a>
        にまとめています。
      </p>

      <h4>ご意見・不具合報告</h4>
      <p>
        考証の誤りや不具合の報告、要望は、タスクバーの「ご意見・不具合報告」から GitHub の Issue
        で受け付けています。
      </p>

      <h4>免責</h4>
      <p>
        年ごとの技術や回線の再現は資料をもとにしていますが、当時の実際とは違うところがあります。書いたHTMLはこのブラウザの中にだけ保存され、サーバーには送りません。アクセス数は
        GoatCounter で数えています。Cookie は使わず、訪問者を特定する情報は残しません。
      </p>
    </>
  );
}
