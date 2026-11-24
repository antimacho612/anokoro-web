import { quizUrl } from "../../../shared/routes/index.ts";
import { MenuBarMenu, menuItemClass } from "../../../shared/ui/menu-bar-menu/index.ts";
import { useKit } from "../../../entities/kit-state/index.ts";

/**
 * ウィンドウのメニューバーの「ヘルプ(H)」。解説と時代まちがいさがしを選ぶメニューを開く。
 * 解説が開いているときは、押すと解説を閉じる
 */
export function HelpMenu() {
  const helpOpen = useKit((s) => s.helpOpen);
  const openHelp = useKit((s) => s.openHelp);
  const closeHelp = useKit((s) => s.closeHelp);

  const closeOpenHelp = (): boolean => {
    if (!helpOpen) return false;
    closeHelp();
    return true;
  };

  return (
    <MenuBarMenu label="ヘルプ(H)" menuLabel="ヘルプ" onBeforeOpen={closeOpenHelp}>
      {(close) => (
        <>
          <li role="none">
            <button
              type="button"
              role="menuitem"
              className={menuItemClass}
              onClick={() => {
                close();
                openHelp();
              }}
            >
              この年の解説
            </button>
          </li>
          <li role="none">
            <a role="menuitem" className={menuItemClass} href={quizUrl(import.meta.env.BASE_URL)}>
              時代まちがいさがし
            </a>
          </li>
        </>
      )}
    </MenuBarMenu>
  );
}
