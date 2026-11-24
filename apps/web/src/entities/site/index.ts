export { captureLinks } from "./lib/link-capture.ts";
export { type LinkTarget, resolveLink } from "./lib/link-target.ts";
export { NOT_FOUND_TITLE, notFoundPage } from "./lib/not-found-page.ts";
export {
  type BrowserHistory,
  canGoBack,
  canGoForward,
  currentEntry,
  goBack,
  goForward,
  pushHistory,
  renameInHistory,
  startHistory,
} from "./model/browser-history.ts";
export {
  addPage,
  canAddPage,
  createSite,
  deletePage,
  findPage,
  findSameSite,
  fromShared,
  homePath,
  INDEX_PAGE,
  needsExportReminder,
  newPageHtml,
  nextPagePath,
  normalizePagePath,
  overwriteWithShared,
  pagePathProblem,
  renamePage,
  toShared,
  updatePageHtml,
} from "./model/site-model.ts";
export { BLANK } from "./model/starter-html.ts";
export { kindTopic, siteTemplate } from "./model/templates.ts";
