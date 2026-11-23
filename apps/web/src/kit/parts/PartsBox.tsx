import { ASSETS, toDataUri } from "@anokoro/assets";
import { useState } from "react";
import { Window } from "../../ui/Window/Window.tsx";
import { HelpButton } from "../help/HelpButton.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { useKit } from "../store.ts";
import styles from "./PartsBox.module.css";
import { useWorkspace } from "../sites/instance.ts";
import { assetSnippet, partAvailability, partsForKind, type Part } from "./parts.ts";

const THUMBNAILS = ASSETS.map((asset) => ({ asset, uri: toDataUri(asset.svg) }));

type PartsBoxProps = {
  onInsert: (text: string) => void;
};

export function PartsBox({ onInsert }: PartsBoxProps) {
  const year = useKit((s) => s.year);
  const [lastPart, setLastPart] = useState<Part | null>(null);
  const kind = useWorkspace((s) => s.sites.find((x) => x.id === s.currentId)?.genre ?? "personal");

  return (
    <Window title="素材・パーツ箱" className={slotClass.parts}>
      <div className="group">
        <b>パーツ（カーソル位置に挿入）</b>
        <div className={styles.parts}>
          {partsForKind(kind).map((part) => {
            const availability = partAvailability(part, year);
            return (
              <button
                key={part.label}
                type="button"
                className="btn"
                disabled={!availability.usable}
                onClick={() => {
                  onInsert(part.code);
                  setLastPart(part);
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
        {lastPart && (
          <p className={`hint ${styles.tip}`}>
            <span>豆知識：{lastPart.tip}</span>
            <HelpButton topic={lastPart.tipTopic} />
          </p>
        )}
        <p className="hint">
          背景にするときは &lt;body background="kabe1.gif"&gt; のようにファイル名で指定します。
        </p>
      </div>
    </Window>
  );
}
