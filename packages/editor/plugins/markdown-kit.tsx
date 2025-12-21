import { MarkdownPlugin, remarkMdx, remarkMention } from "@platejs/markdown";
import { type AnyPluginConfig, KEYS } from "platejs";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export const MarkdownKit: AnyPluginConfig[] = [
  MarkdownPlugin.configure({
    options: {
      disallowedNodes: [KEYS.suggestion],
      remarkPlugins: [remarkMath, remarkGfm, remarkMdx, remarkMention],
    },
  }),
];
