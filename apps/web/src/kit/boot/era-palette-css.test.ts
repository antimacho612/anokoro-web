import { UI_THEMES, type UiThemeId } from "@anokoro/era-data";
import { generate, parse, walk, type CssNode, type Declaration, type Rule } from "css-tree";
import { describe, expect, test } from "vite-plus/test";
import css from "../../ui/themes.css?inline";
import { THEME_CSS_ORIGIN, THEMES, type CssColorRef, type Rgb } from "./era-palette.ts";

const ast = parse(css, { parseCustomProperty: true });

function topLevelRules(): Rule[] {
  const rules: Rule[] = [];
  walk(ast, {
    visit: "Rule",
    enter(node: Rule) {
      if (this.atrule === null) rules.push(node);
    },
  });
  return rules;
}

function selectorsOf(rule: Rule): string[] {
  return generate(rule.prelude)
    .split(",")
    .map((s) => s.trim());
}

function appliesTo(rule: Rule, id: UiThemeId): boolean {
  const selectors = selectorsOf(rule);
  return selectors.includes(":root") || selectors.includes(`:root[data-ui-theme="${id}"]`);
}

function themeVariables(id: UiThemeId): Map<string, CssNode> {
  const vars = new Map<string, CssNode>();
  for (const rule of topLevelRules()) {
    if (!appliesTo(rule, id)) continue;
    rule.block.children.forEach((child) => {
      if (child.type !== "Declaration") return;
      const declaration: Declaration = child;
      if (declaration.property.startsWith("--")) vars.set(declaration.property, declaration.value);
    });
  }
  return vars;
}

function colorsIn(value: CssNode, vars: Map<string, CssNode>): Rgb[] {
  const colors: Rgb[] = [];
  walk(value, {
    enter(node: CssNode) {
      if (node.type === "Hash") {
        const channel = (i: number): number => Number.parseInt(node.value.slice(i, i + 2), 16);
        colors.push([channel(0), channel(2), channel(4)]);
        return walk.skip;
      }
      if (node.type === "Function" && node.name === "rgb") {
        const channels: number[] = [];
        node.children.forEach((c) => {
          if (c.type === "Number" && channels.length < 3) channels.push(Number(c.value));
        });
        colors.push([channels[0] ?? 0, channels[1] ?? 0, channels[2] ?? 0]);
        return walk.skip;
      }
      if (node.type === "Function" && node.name === "var") {
        const name = node.children.first;
        const ref = name?.type === "Identifier" ? vars.get(name.name) : undefined;
        if (ref) colors.push(...colorsIn(ref, vars));
        return walk.skip;
      }
      return undefined;
    },
  });
  return colors;
}

function resolve(id: UiThemeId, { prop, stop = 0 }: CssColorRef): Rgb | undefined {
  const vars = themeVariables(id);
  const value = vars.get(prop);
  return value && colorsIn(value, vars)[stop];
}

function isRounded(id: UiThemeId): boolean {
  const radius = themeVariables(id).get("--win-radius");
  return radius !== undefined && generate(radius).trim() !== "0";
}

test("themes.css にすべての外観がある", () => {
  for (const { id } of UI_THEMES) {
    expect(css).toContain(`[data-ui-theme="${id}"]`);
  }
});

describe.each(UI_THEMES.map((t) => t.id))("%s のトンネルの色は themes.css と一致する", (id) => {
  test("frame", () => {
    expect(resolve(id, THEME_CSS_ORIGIN[id].frame)).toEqual(THEMES[id].frame);
  });
  test("title", () => {
    expect(resolve(id, THEME_CSS_ORIGIN[id].title)).toEqual(THEMES[id].title);
  });
  test("rounded", () => {
    expect(isRounded(id)).toBe(THEMES[id].rounded);
  });
});
