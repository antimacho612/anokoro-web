import { MenuBarMenu, menuItemClass } from "./MenuBarMenu.tsx";
import {
  SOURCE_FONT_SIZES,
  SOURCE_FONT_SIZE_LABELS,
  type SourceFontSize,
} from "./source-font-size.ts";

type FontSizeMenuProps = {
  size: SourceFontSize;
  onChange: (size: SourceFontSize) => void;
};

/** メニューバーの「表示(V)」。ソースの文字の大きさを選ぶ */
export function FontSizeMenu({ size, onChange }: FontSizeMenuProps) {
  return (
    <MenuBarMenu label="表示(V)" menuLabel="表示">
      {(close) => (
        <>
          {SOURCE_FONT_SIZES.map((option) => (
            <li key={option} role="none">
              <button
                type="button"
                role="menuitemradio"
                aria-checked={option === size}
                className={menuItemClass}
                onClick={() => {
                  onChange(option);
                  close();
                }}
              >
                文字の大きさ：{SOURCE_FONT_SIZE_LABELS[option]}
              </button>
            </li>
          ))}
        </>
      )}
    </MenuBarMenu>
  );
}
