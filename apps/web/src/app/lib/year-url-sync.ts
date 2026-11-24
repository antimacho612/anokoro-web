import type { Year } from "@anokoro/era-data";
import type { KitStore } from "../../entities/kit-state/index.ts";
import { readYearParam, withYearParam } from "../../shared/routes/index.ts";

export interface UrlEnv {
  location: Pick<Location, "href" | "search">;
  history: Pick<History, "replaceState" | "state">;
}

/** URL の `?year=` を初期値として読み、以後は年の変更を URL に書き戻す。戻り値で購読を解除する */
export function syncYearWithUrl(store: KitStore, { location, history }: UrlEnv): () => void {
  store.getState().setYear(readYearParam(location.search));
  const writeYear = (year: Year): void => {
    history.replaceState(history.state, "", withYearParam(location.href, year));
  };
  writeYear(store.getState().year);
  return store.subscribe((state, prev) => {
    if (state.year !== prev.year) writeYear(state.year);
  });
}
