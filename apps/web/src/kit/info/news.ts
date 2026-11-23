export interface NewsEntry {
  date: string;
  title: string;
  lines: readonly string[];
}

export const NEWS: readonly NewsEntry[] = [
  {
    date: "2026-11-22",
    title: "タスクバーを追加しました",
    lines: [
      "画面の上にタスクバーを置きました。使い方、解説、このお知らせ、このサイトについてを開けます。",
      "「この年の URL をコピー」で、選んでいる年のままキットを人に教えられます。",
    ],
  },
  {
    date: "2026-11-22",
    title: "作成キットの試作版を公開しました",
    lines: [
      "メモ帳、疑似ブラウザ、回線、時代チェッカー、素材・パーツ箱、解説がそろいました。",
      "タイムマシンで 1995 年から 2015 年までを切り替えると、ブラウザの見え方、使える回線、ウィンドウの外観が変わります。",
    ],
  },
];
