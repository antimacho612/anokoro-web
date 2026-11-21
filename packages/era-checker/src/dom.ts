// parse5 の木を操作する小さな道具
import { defaultTreeAdapter, html, type DefaultTreeAdapterTypes as T } from "parse5";

export type Element = T.Element;
export type ParentNode = T.ParentNode;
export type ChildNode = T.ChildNode;

export function isElement(node: T.Node): node is Element {
  return "tagName" in node;
}

/** 子ノード（template は中身） */
export function childrenOf(node: ParentNode): ChildNode[] {
  return node.nodeName === "template" ? (node as T.Template).content.childNodes : node.childNodes;
}

export function getAttr(el: Element, name: string): string | undefined {
  return el.attrs.find((a) => a.name === name)?.value;
}

export function setAttr(el: Element, name: string, value: string): void {
  const attr = el.attrs.find((a) => a.name === name);
  if (attr) attr.value = value;
  else el.attrs.push({ name, value });
}

export function removeAttr(el: Element, name: string): void {
  el.attrs = el.attrs.filter((a) => a.name !== name);
}

export function createElement(
  tagName: string,
  attrs: Record<string, string> = {},
  text?: string,
): Element {
  const el = defaultTreeAdapter.createElement(
    tagName,
    html.NS.HTML,
    Object.entries(attrs).map(([name, value]) => ({ name, value })),
  );
  if (text !== undefined) defaultTreeAdapter.insertText(el, text);
  return el;
}

/** 子ノードを 1 つの文字列ノードに置き換える */
export function setText(el: Element, text: string): void {
  for (const child of el.childNodes) child.parentNode = null;
  el.childNodes.length = 0;
  if (text !== "") defaultTreeAdapter.insertText(el, text);
}

function pushReversed(stack: ChildNode[], nodes: readonly ChildNode[]): void {
  for (let i = nodes.length - 1; i >= 0; i--) {
    const n = nodes[i];
    if (n) stack.push(n);
  }
}

/** 子孫の文字をつなげたもの（深い木でもスタックを使い切らない） */
export function textContent(node: ParentNode): string {
  let out = "";
  const stack: ChildNode[] = [];
  pushReversed(stack, childrenOf(node));
  while (stack.length > 0) {
    const n = stack.pop();
    if (!n) break;
    if (n.nodeName === "#text") out += (n as T.TextNode).value;
    else if (isElement(n)) pushReversed(stack, childrenOf(n));
  }
  return out;
}

/** 文書順で最初に見つかった、その名前の要素 */
export function findElement(root: ParentNode, tagName: string): Element | undefined {
  const stack: ChildNode[] = [];
  pushReversed(stack, childrenOf(root));
  while (stack.length > 0) {
    const n = stack.pop();
    if (!n) break;
    if (!isElement(n)) continue;
    if (n.tagName === tagName) return n;
    pushReversed(stack, childrenOf(n));
  }
  return undefined;
}
