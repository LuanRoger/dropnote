"use client";

import {
  BoldPlugin,
  CodePlugin,
  HighlightPlugin,
  ItalicPlugin,
  KbdPlugin,
  StrikethroughPlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  UnderlinePlugin,
} from "@platejs/basic-nodes/react";

import { createMarkInputRule, KEYS } from "platejs";

import { CodeLeaf } from "../components/code-node";
import { HighlightLeaf } from "../components/highlight-node";
import { KbdLeaf } from "../components/kbd-node";

const markRule = (delimiter: string, marks: string[]) =>
  createMarkInputRule({
    // Input rules see the text before the final closing character is inserted.
    start: delimiter,
    end: delimiter.slice(0, -1),
    trigger: delimiter.slice(-1),
    marks,
    priority: delimiter.length,
    enabled: ({ editor, getBlockTextBeforeSelection }) => {
      if (
        editor.api.some({
          match: { type: editor.getType(KEYS.codeBlock) },
        })
      ) {
        return false;
      }

      // Do not consume __word__ early when the opening is __* or __**.
      const beforeEnd = getBlockTextBeforeSelection().slice(
        0,
        delimiter.length > 1 ? 1 - delimiter.length : undefined
      );
      const opening = beforeEnd.slice(beforeEnd.lastIndexOf(delimiter));
      return !["***", "__*", "__**", "___***", "**", "__", "~~"].some(
        (longer) =>
          longer.length > delimiter.length &&
          longer.startsWith(delimiter) &&
          opening.startsWith(longer)
      );
    },
  });

export const BasicMarksKit = [
  BoldPlugin.configure({
    inputRules: [
      markRule("***", [KEYS.bold, KEYS.italic]),
      markRule("__*", [KEYS.underline, KEYS.italic]),
      markRule("__**", [KEYS.underline, KEYS.bold]),
      markRule("___***", [KEYS.underline, KEYS.bold, KEYS.italic]),
      markRule("**", [KEYS.bold]),
    ],
  }),
  ItalicPlugin.configure({
    inputRules: [markRule("*", [KEYS.italic]), markRule("_", [KEYS.italic])],
  }),
  UnderlinePlugin.configure({
    inputRules: [markRule("__", [KEYS.underline])],
  }),
  CodePlugin.configure({
    inputRules: [markRule("`", [KEYS.code])],
    node: { component: CodeLeaf },
    shortcuts: { toggle: { keys: "mod+e" } },
  }),
  StrikethroughPlugin.configure({
    inputRules: [markRule("~~", [KEYS.strikethrough])],
    shortcuts: { toggle: { keys: "mod+shift+x" } },
  }),
  SubscriptPlugin.configure({
    inputRules: [markRule("~", [KEYS.sub])],
    shortcuts: { toggle: { keys: "mod+comma" } },
  }),
  SuperscriptPlugin.configure({
    inputRules: [markRule("^", [KEYS.sup])],
    shortcuts: { toggle: { keys: "mod+period" } },
  }),
  HighlightPlugin.configure({
    inputRules: [
      markRule("==", [KEYS.highlight]),
      markRule("≡", [KEYS.highlight]),
    ],
    node: { component: HighlightLeaf },
    shortcuts: { toggle: { keys: "mod+shift+h" } },
  }),
  KbdPlugin.withComponent(KbdLeaf),
];
