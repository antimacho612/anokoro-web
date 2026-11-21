import { ASSETS, toDataUri } from "@anokoro/assets";
import { useState } from "react";
import { Window } from "../../ui/Window/Window.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { useKit } from "../store.ts";
import styles from "./PartsBox.module.css";
import { PARTS, assetSnippet, partAvailability } from "./parts.ts";

const THUMBNAILS = ASSETS.map((asset) => ({ asset, uri: toDataUri(asset.svg) }));

type PartsBoxProps = {
  onInsert: (text: string) => void;
};

export function PartsBox({ onInsert }: PartsBoxProps) {
  const year = useKit((s) => s.year);
  const [tip, setTip] = useState<string | null>(null);

  return (
    <Window title="素材・パーツ箱" className={slotClass.parts}>
      <div className="group">
        <b>パーツ（カーソル位置に挿入）</b>
        <div className={styles.parts}>
          {PARTS.map((part) => {
            const availability = partAvailability(part, year);
            return (
              <button
                key={part.label}
                type="button"
                className="btn"
                disabled={!availability.usable}
                onClick={() => {
                  onInsert(part.code);
                  setTip(part.tip);
                }}
              >
                {part.label}
                {!availability.usable && `（${availability.label}）`}
              </button>
            );
          })}
        </div>
      </div>
      <div className="group">
        <b>素材集（クリックで挿入）</b>
        <div className={styles.assets}>
          {THUMBNAILS.map(({ asset, uri }) => (
            <button
              key={asset.name}
              type="button"
              className={styles.asset}
              title="クリックで挿入"
              onClick={() => onInsert(assetSnippet(asset))}
            >
              {asset.kind === "wallpaper" ? (
                <span className={styles.thumb} style={{ backgroundImage: `url("${uri}")` }} />
              ) : (
                <span className={styles.thumb}>
                  <img src={uri} alt="" />
                </span>
              )}
              <span>{asset.name}</span>
            </button>
          ))}
        </div>
        {tip && <p className="hint">豆知識：{tip}</p>}
        <p className="hint">
          背景にするときは &lt;body background="kabe1.gif"&gt; のようにファイル名で指定します。
        </p>
      </div>
    </Window>
  );
}
