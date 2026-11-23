export type TourTarget = "timeMachine" | "notepad" | "browser" | "checker" | "line";

export interface TourStep {
  /** 強調する場所。null なら画面の中央に出す */
  target: TourTarget | null;
  title: string;
  body: string;
}

export const ONBOARDING_STEPS: readonly TourStep[] = [
  {
    target: null,
    title: "あのころ Web へようこそ",
    body: "1995〜2015 年の Web のページ作りを、年を切り替えながら体験できます。主な画面を順に紹介します。",
  },
  {
    target: "timeMachine",
    title: "年を切り替える",
    body: "1995 年から 2015 年までを 1 年ずつ選べます。年を変えると、使えるタグや CSS、回線、画面の見た目が切り替わります。書いた HTML はそのまま残ります。",
  },
  {
    target: "notepad",
    title: "HTML を書く",
    body: "メモ帳に HTML を書きます。書いた内容は、このブラウザの中に自動で保存されます。「素材・パーツ箱」のボタンで、当時よく使われたタグや素材も入れられます。",
  },
  {
    target: "browser",
    title: "見え方を確かめる",
    body: "書いたページを、選んだ年のブラウザ「ネットサーファー」で表示します。解像度を切り替えると、当時の画面の広さで見られます。",
  },
  {
    target: "checker",
    title: "時代に合っているか調べる",
    body: "選んだ年に合わない書き方を警告し、再現度を出します。「解説」を押すと、その技術の当時の話を読めます。",
  },
  {
    target: "line",
    title: "当時の回線で読み込む",
    body: "回線を選んで接続し、疑似ブラウザの「更新」を押すと、その速さでページを読み込みます。ダイヤルアップでは通話料もかかります。",
  },
  {
    target: null,
    title: "準備ができました",
    body: "このツアーは、タスクバーの「使い方」からいつでも見直せます。",
  },
];
