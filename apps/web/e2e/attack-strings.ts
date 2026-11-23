/** スクリプトが動いたときだけ送られるリクエストのパス。文字列をつないで作るので、HTML に直接は現れない */
export const PWNED_PATH = "/__pwned";

const JS = "fetch('/__pw'+'ned')";

/** よく知られた XSS の手口をもとにした攻撃文字列。どれもスクリプトが動けば `PWNED_PATH` に通信する */
export const ATTACK_STRINGS: readonly string[] = [
  `<script>${JS}</script>`,
  `<SCRIPT>${JS}</SCRIPT>`,
  `<scr<script>ipt>${JS}</scr</script>ipt>`,
  `<img src="x" onerror="${JS}">`,
  `<img src=x onerror=${JS}>`,
  `<IMG SRC="x" ONERROR="${JS}">`,
  `<body onload="${JS}">`,
  `<svg onload="${JS}"></svg>`,
  `<svg><script>${JS}</script></svg>`,
  `<math><mtext><table><mglyph><style><img src=x onerror="${JS}"></style></mglyph></table></mtext></math>`,
  `<noscript><p title="</noscript><img src=x onerror=${JS}>"></p></noscript>`,
  `<iframe src="javascript:${JS}"></iframe>`,
  `<iframe srcdoc="<script>${JS}</script>"></iframe>`,
  `<object data="data:text/html,<script>${JS}</script>"></object>`,
  `<embed src="data:text/html,<script>${JS}</script>">`,
  `<meta http-equiv="refresh" content="0;url=javascript:${JS}">`,
  `<base href="javascript:/">`,
  `<link rel="stylesheet" href="javascript:${JS}">`,
  `<style>@import 'javascript:${JS}';</style>`,
  `<div style="background:url(javascript:${JS})">背景</div>`,
  `<div style="width:expression(${JS})">expression</div>`,
  `<details open ontoggle="${JS}"><summary>詳細</summary></details>`,
  `<input autofocus onfocus="${JS}">`,
  `<marquee onstart="${JS}">流れる文字</marquee>`,
  `<video><source onerror="${JS}"></video>`,
  `<template><script>${JS}</script></template>`,
  `<a href="javascript:${JS}">リンク1</a>`,
  `<a href="JaVaScRiPt:${JS}">リンク2</a>`,
  `<a href="&#106;avascript:${JS}">リンク3</a>`,
  `<a href="java&#x09;script:${JS}">リンク4</a>`,
  `<a href=" &#14; javascript:${JS}">リンク5</a>`,
  `<a href="data:text/html,<script>${JS}</script>">リンク6</a>`,
  `<a href="vbscript:msgbox(1)">リンク7</a>`,
  `<form action="javascript:${JS}"><button>送信</button></form>`,
  `<button formaction="javascript:${JS}">ボタン</button>`,
  `<area href="javascript:${JS}">`,
];

export function attackPage(): string {
  return `<html><head><title>攻撃のテスト</title></head><body>${ATTACK_STRINGS.join("\n")}</body></html>`;
}
