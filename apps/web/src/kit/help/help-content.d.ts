declare module "virtual:anokoro-help" {
  import type { HelpTopic } from "@anokoro/help";

  /** content/help の解説。ビルド時に @anokoro/help/vite が作る */
  export const topics: readonly HelpTopic[];
}
