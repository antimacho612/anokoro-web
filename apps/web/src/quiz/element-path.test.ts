import { describe, expect, it } from "vite-plus/test";
import { elementPath, findByPath, type TreeNode } from "./element-path.ts";

interface FakeNode extends TreeNode<FakeNode> {
  name: string;
  parentElement: FakeNode | null;
  children: FakeNode[];
}

function node(name: string, children: FakeNode[] = []): FakeNode {
  const self: FakeNode = { name, parentElement: null, children };
  for (const child of children) child.parentElement = self;
  return self;
}

const target = node("td");
const other = node("p");
const body = node("body", [node("center", [node("font"), node("table", [target])]), other]);
const outside = node("div");

describe("elementPath", () => {
  it("root からの子の位置をつなぐ", () => {
    expect(elementPath(body, target)).toBe("0.1.0");
    expect(elementPath(body, other)).toBe("1");
    expect(elementPath(body, body)).toBe("");
  });

  it("root の外なら undefined", () => {
    expect(elementPath(body, outside)).toBeUndefined();
  });
});

describe("findByPath", () => {
  it("elementPath の逆", () => {
    expect(findByPath(body, "0.1.0")).toBe(target);
    expect(findByPath(body, "")).toBe(body);
    expect(findByPath(body, "5.2")).toBeUndefined();
  });
});
