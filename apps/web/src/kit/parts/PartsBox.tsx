import { ASSETS, toDataUri } from "@anokoro/assets";
import { useState } from "react";
import { Window } from "../../ui/Window/Window.tsx";
import { HelpButton } from "../help/HelpButton.tsx";
import { slotClass } from "../layout/KitLayout.tsx";
import { useKit } from "../store.ts";
import styles from "./PartsBox.module.css";
import { useWorkspace } from "../sites/instance.ts";
import { assetBytesLabel, assetGroups, assetSnippet } from "./asset-gallery.ts";
import { MODERN_CODE_PART } from "./part-list.ts";
import { partCode, partShelf, type PartBase } from "./parts.ts";

const THUMBNAIL_URIS = new Map(ASSETS.map((asset) => [asset.name, toDataUri(asset.svg)]));

type PartsBoxProps = {
  onInsert: (text: string) => void;
};

export function PartsBox({ onInsert }: PartsBoxProps) {
  const year = useKit((s) => s.year);
  const [lastPart, setLastPart] = useState<PartBase | null>(null);
  const kind = useWorkspace((s) => s.sites.find((x) => x.id === s.currentId)?.genre ?? "personal");
  const shelf = partShelf(kind, year);
  const insertPart = (part: PartBase) => {
    onInsert(partCode(part, year));
    setLastPart(part);
  };

  return (
    <Window title="素材・パーツ箱" className={slotClass.parts}>
      <div className="group">
        <b>パーツ（カーソル位置に挿入）</b>
        {shelf.popular.map((group) => (
          <section key={group.key} className={styles.partGroup}>
            <h4 className={styles.heading}>{group.label}</h4>
            <div className={styles.parts}>
              {group.parts.map((part) => (
                <button
                  key={part.label}
                  type="button"
                  className="btn"
                  onClick={() => insertPart(part)}
                >
                  {part.label}
                </button>
              ))}
            </div>
          </section>
        ))}
        {shelf.past.length > 0 && (
          <details className={styles.partGroup}>
            <summary className={styles.heading}>流行が過ぎたパーツ（{shelf.past.length}）</summary>
            <div className={styles.parts}>
              {shelf.past.map(({ part, label }) => (
                <button
                  key={part.label}
                  type="button"
                  className="btn"
                  onClick={() => insertPart(part)}
                >
                  {part.label}（{label}）
                </button>
              ))}
            </div>
          </details>
        )}
        {shelf.future.length > 0 && (
          <details className={styles.partGroup}>
            <summary className={styles.heading}>まだないパーツ（{shelf.future.length}）</summary>
            <div className={styles.parts}>
              {shelf.future.map(({ part, label }) => (
                <button key={part.label} type="button" className="btn" disabled>
                  {part.label}（{label}）
                </button>
              ))}
            </div>
          </details>
        )}
        <section className={styles.partGroup}>
          <h4 className={styles.heading}>試す</h4>
          <div className={styles.parts}>
            <button type="button" className="btn" onClick={() => insertPart(MODERN_CODE_PART)}>
              {MODERN_CODE_PART.label}
            </button>
          </div>
        </section>
      </div>
      <div className="group">
        <b>素材集（クリックで挿入）</b>
        {assetGroups(year).map((group) => (
          <section key={group.category} className={styles.partGroup}>
            <h4 className={styles.heading}>{group.label}</h4>
            <div className={styles.assets}>
              {group.assets.map((asset) => {
                const uri = THUMBNAIL_URIS.get(asset.name);
                return (
                  <button
                    key={asset.name}
                    type="button"
                    className={styles.asset}
                    title="クリックで挿入"
                    onClick={() => onInsert(assetSnippet(asset))}
                  >
                    {asset.category === "wallpaper" ? (
                      <span className={styles.thumb} style={{ backgroundImage: `url("${uri}")` }} />
                    ) : (
                      <span className={styles.thumb}>
                        <img src={uri} alt="" />
                      </span>
                    )}
                    <span>{asset.name}</span>
                    <span className={styles.bytes}>{assetBytesLabel(asset)}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
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
