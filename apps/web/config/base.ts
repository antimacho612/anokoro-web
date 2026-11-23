export function resolveBase(raw: string | undefined): string {
  const trimmed = raw?.trim() ?? "";
  if (trimmed === "" || trimmed === "/") return "/";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) {
    return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
  }
  const inner = trimmed.replace(/^\/+|\/+$/g, "");
  return `/${inner}/`;
}
