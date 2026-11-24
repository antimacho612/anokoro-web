/**
 * 疑似ブラウザの表示枠の中でリンクが押されたら知らせる。
 * 表示枠はスクリプトを動かさない sandbox なので、親のページから文書にリスナーを付ける。
 * onLink が true を返したら、表示枠の中での移動を止める
 */
export function captureLinks(doc: Document, onLink: (href: string) => boolean): void {
  const view = doc.defaultView;
  if (!view) return;
  doc.addEventListener("click", (e) => {
    const target = e.target;
    if (!(target instanceof view.Element)) return;
    const href = target.closest("a[href], area[href]")?.getAttribute("href");
    if (href != null && onLink(href)) e.preventDefault();
  });
}
