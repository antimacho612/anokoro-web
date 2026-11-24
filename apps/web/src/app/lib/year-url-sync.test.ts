import { describe, expect, it } from "vite-plus/test";
import { createKitStore } from "../../entities/kit-state/index.ts";
import { syncYearWithUrl, type UrlEnv } from "./year-url-sync.ts";

function fakeEnv(href: string): UrlEnv & { replaced: string[] } {
  const url = new URL(href);
  const replaced: string[] = [];
  return {
    replaced,
    location: {
      get href() {
        return url.href;
      },
      get search() {
        return url.search;
      },
    },
    history: {
      state: null,
      replaceState: (_data, _unused, next) => {
        const nextUrl = new URL(String(next));
        url.search = nextUrl.search;
        replaced.push(nextUrl.href);
      },
    },
  };
}

describe("syncYearWithUrl", () => {
  it("URL の年を初期値にする", () => {
    const store = createKitStore();
    syncYearWithUrl(store, fakeEnv("https://example.com/kit/?year=2003"));
    expect(store.getState().year).toBe(2003);
  });

  it("年がない URL には既定の年を書き込む", () => {
    const store = createKitStore();
    const env = fakeEnv("https://example.com/kit/");
    syncYearWithUrl(store, env);
    expect(env.replaced).toEqual(["https://example.com/kit/?year=1995"]);
  });

  it("年を変えると URL を書き換え、解除後は書き換えない", () => {
    const store = createKitStore();
    const env = fakeEnv("https://example.com/kit/?year=2003#s=abc");
    const unsubscribe = syncYearWithUrl(store, env);
    store.getState().stepYear(1);
    expect(env.location.href).toBe("https://example.com/kit/?year=2004#s=abc");
    unsubscribe();
    store.getState().stepYear(1);
    expect(env.location.href).toBe("https://example.com/kit/?year=2004#s=abc");
  });
});
