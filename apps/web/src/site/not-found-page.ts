const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

export const NOT_FOUND_TITLE = "ページが見つかりません";

/** 疑似ブラウザで開けない場所を開いたときの画面。文言は独自に書いたもの */
export function notFoundPage(url: string): string {
  return `<html>
<head><title>${NOT_FOUND_TITLE}</title></head>
<body bgcolor="#FFFFFF" text="#000000">
<table width="480" cellpadding="4"><tr><td>
<font face="MS UI Gothic" size="2">
<b><font size="4">${NOT_FOUND_TITLE}</font></b>
<hr>
<p>お探しのページは見つかりませんでした。アドレスが間違っているか、ページが移動、または削除されたのかもしれません。</p>
<p>アドレス: <tt>${escapeHtml(url)}</tt></p>
<p>・アドレスをもう一度たしかめてください。<br>
・「戻る」ボタンで前のページに戻れます。</p>
<p><font color="#808080">ネットサーファーでは、ホームページ作成キットで作ったサイトの中だけを見られます。</font></p>
</font>
</td></tr></table>
</body>
</html>`;
}
