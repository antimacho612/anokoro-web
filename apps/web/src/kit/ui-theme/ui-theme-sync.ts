import { uiThemeForYear, type Year } from "@anokoro/era-data";
import type { KitStore } from "../store.ts";

/** 年に合う外観の ID を `data-ui-theme` 属性に書き、年の変更に追従する。戻り値で購読を解除する */
export function syncUiTheme(store: KitStore, root: Pick<HTMLElement, "dataset">): () => void {
  const apply = (year: Year): void => {
    root.dataset.uiTheme = uiThemeForYear(year).id;
  };
  apply(store.getState().year);
  return store.subscribe((state, prev) => {
    if (state.year !== prev.year) apply(state.year);
  });
}
