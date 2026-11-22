import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "../store.ts";
import { syncUiTheme } from "./ui-theme-sync.ts";

describe("syncUiTheme", () => {
  it("今の年の外観を書き、年を変えると書き換え、解除後は書き換えない", () => {
    const store = createKitStore({ year: 2000 });
    const root = { dataset: {} as DOMStringMap };
    const unsubscribe = syncUiTheme(store, root);
    expect(root.dataset.uiTheme).toBe("gray-gradient");
    store.getState().setYear(2001);
    expect(root.dataset.uiTheme).toBe("blue-round");
    unsubscribe();
    store.getState().setYear(2015);
    expect(root.dataset.uiTheme).toBe("blue-round");
  });
});
