import { getLine, isLineKey, linesForYear } from "@anokoro/era-data";
import { useEffect, useState } from "react";
import { Window } from "../../../shared/ui/window/index.ts";
import { HelpButton } from "../../../features/help/index.ts";
import { slotClass } from "../../../shared/ui/kit-layout/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";
import { LINE_NOTES } from "../lib/line-notes.ts";
import { connectionText, feeText, lastLoadText } from "../lib/line-text.ts";
import styles from "./LineWindow.module.css";
import { netController } from "../../../features/dialup/index.ts";

const CLOCK_TICK_MS = 1000;

function useNow(active: boolean): Date {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => setNow(new Date()), CLOCK_TICK_MS);
    return () => window.clearInterval(id);
  }, [active]);
  return active ? now : new Date();
}

export function LineWindow() {
  const year = useKit((s) => s.year);
  const lineKey = useKit((s) => s.lineKey);
  const connection = useKit((s) => s.connection);
  const connectedAtMs = useKit((s) => s.connectedAtMs);
  const dialMessage = useKit((s) => s.dialMessage);
  const sound = useKit((s) => s.sound);
  const setSound = useKit((s) => s.setSound);
  const lastLoad = useKit((s) => s.lastLoad);
  const now = useNow(connection === "online");

  const line = getLine(lineKey);
  const dialup = line.dial !== "always";
  const lampClass =
    connection === "dialing"
      ? styles.busy
      : connection === "online" || !dialup
        ? styles.on
        : undefined;

  const handleLineChange = (value: string): void => {
    if (isLineKey(value)) netController.changeLine(value);
  };

  const handleDialButton = (): void => {
    if (connection === "offline") netController.connectByUser();
    else netController.hangup();
  };

  return (
    <Window title="回線とダイヤルアップ接続" className={slotClass.line}>
      <div className={styles.row}>
        <label className={styles.lineSelect}>
          回線:
          <select value={lineKey} onChange={(e) => handleLineChange(e.currentTarget.value)}>
            {linesForYear(year).map((l) => (
              <option key={l.key} value={l.key}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          <input
            type="checkbox"
            checked={sound}
            onChange={(e) => setSound(e.currentTarget.checked)}
          />
          接続音を鳴らす
        </label>
      </div>
      <div className={styles.row}>
        <span className={lampClass ? `${styles.lamp} ${lampClass}` : styles.lamp} />
        <span role="status">{connectionText(line, connection)}</span>
        {dialup && (
          <button type="button" className={`btn ${styles.dialButton}`} onClick={handleDialButton}>
            {connection === "offline" ? "接続" : "切断"}
          </button>
        )}
      </div>
      {connection === "dialing" && (
        <div className={`${styles.dialbox} sunken`}>
          <span className={styles.icon} aria-hidden="true">
            📞
          </span>
          <span>{dialMessage}</span>
        </div>
      )}
      <div className={`${styles.row} ${styles.small}`}>
        {feeText(line, connection === "online" ? connectedAtMs : null, now)}
      </div>
      {dialup && (
        <p className="hint">
          ※通話料は当時の再現です。実際に電話をかけたり、お金がかかったりすることはありません。
        </p>
      )}
      <div className={`${styles.row} ${styles.small} ${styles.note}`}>
        <span>💡 {LINE_NOTES[lineKey]}</span>
        <HelpButton topic="line" />
      </div>
      {lastLoad && <div className={`${styles.row} ${styles.small}`}>{lastLoadText(lastLoad)}</div>}
      <p className="hint">
        ブラウザの「更新」を押すと、選んだ回線の速さでページを読み込みます。メモ帳で編集している間はローカル表示（一瞬で表示）です。
      </p>
    </Window>
  );
}
