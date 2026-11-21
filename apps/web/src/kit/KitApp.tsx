import { Window } from "../ui/Window/Window.tsx";
import styles from "./KitApp.module.css";
import { KitLayout, slotClass } from "./layout/KitLayout.tsx";
import { useKit } from "./store.ts";
import { TimeMachineBar } from "./time-machine/TimeMachineBar.tsx";

function Pending() {
  return <p className="hint">準備中です。</p>;
}

export function KitApp() {
  const year = useKit((s) => s.year);

  const left = (
    <>
      <Window title="index.html - メモ帳" controls={["_", "□", "×"]} className={slotClass.notepad}>
        <Pending />
      </Window>
      <Window title="素材・パーツ箱" className={slotClass.parts}>
        <Pending />
      </Window>
    </>
  );

  const right = (
    <>
      <Window title="ネットサーファー" controls={["_", "□", "×"]} className={slotClass.browser}>
        <Pending />
      </Window>
      <Window title="回線とダイヤルアップ接続" className={slotClass.line}>
        <Pending />
      </Window>
      <Window title={`時代チェッカー - ${year}年モード`} className={slotClass.checker}>
        <Pending />
      </Window>
      <Window title="ヘルプ - あのころのWeb解説" controls={["?", "×"]} className={slotClass.help}>
        <Pending />
      </Window>
    </>
  );

  return (
    <>
      <header className={styles.top}>
        <h1 className="dot">あのころ Web ホームページ作成キット</h1>
        <p>
          メモ帳にHTMLを書くと、選んだ年のブラウザでの見え方を再現します。時代に合わないタグやCSSは「時代チェッカー」が見つけて無効化します。
        </p>
      </header>
      <TimeMachineBar />
      <main>
        <KitLayout left={left} right={right} />
      </main>
    </>
  );
}
