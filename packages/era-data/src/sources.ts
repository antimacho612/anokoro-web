import type { Source } from "./years.ts";

// 複数の行で使う出典
export const caniuse = (slug: string, title: string): Source => ({
  title: `Can I use: ${title}`,
  url: `https://caniuse.com/${slug}`,
});

export const SRC = {
  ieHistory: {
    title: "Wikipedia: Internet Explorer version history",
    url: "https://en.wikipedia.org/wiki/Internet_Explorer_version_history",
  },
  firefoxHistory: {
    title: "Wikipedia: Firefox version history",
    url: "https://en.wikipedia.org/wiki/Firefox_version_history",
  },
  html32: {
    title: "W3C: HTML 3.2 Reference Specification",
    url: "https://www.w3.org/TR/2018/SPSD-html32-20180315/",
  },
  html401: { title: "W3C: HTML 4.01 Specification", url: "https://www.w3.org/TR/html401/" },
  css1: { title: "W3C: CSS1", url: "https://www.w3.org/TR/CSS1/" },
  obsolete: {
    title: "HTML Living Standard: Obsolete features",
    url: "https://html.spec.whatwg.org/multipage/obsolete.html",
  },
  blink: {
    title: "MDN: <blink>",
    url: "https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/blink",
  },
  // 回線
  telehoudai: {
    title: "Wikipedia: テレホーダイ",
    url: "https://ja.wikipedia.org/wiki/テレホーダイ",
  },
  modem: { title: "Wikipedia: モデム", url: "https://ja.wikipedia.org/wiki/モデム" },
  ins: { title: "Wikipedia: INSネット", url: "https://ja.wikipedia.org/wiki/INSネット" },
  adsl: { title: "Wikipedia: ADSL", url: "https://ja.wikipedia.org/wiki/ADSL" },
  yahooBB: { title: "Wikipedia: Yahoo! BB", url: "https://ja.wikipedia.org/wiki/Yahoo!_BB" },
  ftth: { title: "Wikipedia: FTTH", url: "https://ja.wikipedia.org/wiki/FTTH" },
  bflets: { title: "Wikipedia: Bフレッツ", url: "https://ja.wikipedia.org/wiki/Bフレッツ" },
  // 解像度
  w3schoolsDisplay: {
    title: "W3Schools: Browser Display Statistics",
    url: "https://www.w3schools.com/browsers/browsers_display.asp",
  },
  statcounterJp: {
    title: "StatCounter: Desktop Screen Resolution Stats Japan",
    url: "https://gs.statcounter.com/screen-resolution-stats/desktop/japan/#yearly-2009-2015",
  },
  // 作成キットの外観（日本での発売日）
  win95: {
    title: "Wikipedia: Microsoft Windows 95",
    url: "https://ja.wikipedia.org/wiki/Microsoft_Windows_95",
  },
  win98: {
    title: "Wikipedia: Microsoft Windows 98",
    url: "https://ja.wikipedia.org/wiki/Microsoft_Windows_98",
  },
  winXp: {
    title: "Wikipedia: Microsoft Windows XP",
    url: "https://ja.wikipedia.org/wiki/Microsoft_Windows_XP",
  },
  winVista: {
    title: "Wikipedia: Microsoft Windows Vista",
    url: "https://ja.wikipedia.org/wiki/Microsoft_Windows_Vista",
  },
  win8: {
    title: "Wikipedia: Microsoft Windows 8",
    url: "https://ja.wikipedia.org/wiki/Microsoft_Windows_8",
  },
  win10: {
    title: "Wikipedia: Microsoft Windows 10",
    url: "https://ja.wikipedia.org/wiki/Microsoft_Windows_10",
  },
} as const satisfies Record<string, Source>;
