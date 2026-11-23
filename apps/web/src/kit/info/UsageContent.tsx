import { flushSync } from "react-dom";
import { onboardingStore } from "../onboarding/onboarding-store.ts";
import { useKit } from "../store.ts";

export function UsageContent() {
  const closeInfo = useKit((s) => s.closeInfo);
  const handleReplayTour = (): void => {
    flushSync(closeInfo);
    const opener = document.activeElement;
    onboardingStore.getState().start(opener instanceof HTMLElement ? opener : null);
  };
  return (
    <>
      <p>
        <button type="button" className="btn" onClick={handleReplayTour}>
          ツアーをもう一度見る
        </button>
      </p>
      <h3>あのころ Web ホームページ作成キット</h3>
      <p>
        メモ帳にHTMLを書くと、選んだ年のブラウザでの見え方を再現します。時代に合わないタグやCSSは「時代チェッカー」が見つけて無効化します。
      </p>

      <h4>タイムマシン</h4>
      <p>
        1995年から2015年までを1年ずつ選べます。年を変えると、使えるタグやCSS、回線、画面の解像度、ウィンドウの見た目が切り替わります。書いたHTMLはそのまま残ります。
      </p>

      <h4>メモ帳</h4>
      <p>
        ここにHTMLを書きます。入力が止まると、疑似ブラウザの表示が新しくなります。書いた内容は、このブラウザの中に自動で保存されます。
      </p>

      <h4>素材・パーツ箱</h4>
      <p>
        ボタンを押すと、当時よく使われたタグや素材をメモ帳のカーソルの位置に入れます。豆知識の「解説」から、くわしい話を読めます。
      </p>

      <h4>疑似ブラウザ</h4>
      <p>
        架空のブラウザ「ネットサーファー」で、書いたページを表示します。解像度を切り替えると、当時の画面の広さで見られます。「更新」を押すと、回線を通して読み込み直します。
      </p>

      <h4>回線とダイヤルアップ接続</h4>
      <p>
        回線を選んで接続すると、その速さでページを読み込みます。ダイヤルアップでは、つないでいる時間に応じて通話料がかかります。
      </p>

      <h4>時代チェッカー</h4>
      <p>
        選んだ年に合わない書き方を警告し、再現度を出します。警告を押すとメモ帳の該当行へ移り、「解説」を押すとその技術の話を読めます。
      </p>

      <h4>解説</h4>
      <p>
        タスクバーの「解説」、タイムマシンの「この年の解説」、各ウィンドウの「ヘルプ(H)」から開けます。選んだ年までの出来事だけが載ります。
      </p>
    </>
  );
}
