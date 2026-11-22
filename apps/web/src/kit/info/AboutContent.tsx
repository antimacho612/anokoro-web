import { ASSETS, BROKEN_IMAGE, PENDING_IMAGE, SITE_ICON, type AssetRights } from "@anokoro/assets";

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

      <h4>免責</h4>
      <p>
        年ごとの技術や回線の再現は資料をもとにしていますが、当時の実際とは違うところがあります。書いたHTMLはこのブラウザの中にだけ保存され、サーバーには送りません。
      </p>
    </>
  );
}
