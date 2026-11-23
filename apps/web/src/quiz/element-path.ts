/** 要素の木をたどるのに使う部分だけ */
export interface TreeNode<N> {
  readonly parentElement: N | null;
  readonly children: ArrayLike<N>;
}

/**
 * root から target までの子の位置を「.」でつないだもの。root 自身は ""。
 * 読み込み直しても同じ要素を指すので、選んだ場所の印を付け直すのに使う。root の外なら undefined
 */
export function elementPath<N extends TreeNode<N>>(root: N, target: N): string | undefined {
  const indices: number[] = [];
  let node = target;
  while (node !== root) {
    const parent = node.parentElement;
    if (parent === null) return undefined;
    indices.unshift(Array.prototype.indexOf.call(parent.children, node));
    node = parent;
  }
  return indices.join(".");
}

export function findByPath<N extends TreeNode<N>>(root: N, path: string): N | undefined {
  if (path === "") return root;
  let node: N | undefined = root;
  for (const part of path.split(".")) {
    node = node?.children[Number(part)];
  }
  return node;
}
