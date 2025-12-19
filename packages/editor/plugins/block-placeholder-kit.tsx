"use client";

import { KEYS } from "platejs";
import { BlockPlaceholderPlugin } from "platejs/react";

export const BlockPlaceholderKit = [
  BlockPlaceholderPlugin.configure({
    options: {
      className:
        "before:absolute before:cursor-text before:opacity-30 before:content-[attr(placeholder)]",
      placeholders: {
        [KEYS.p]: "Start typing or type '/' for commands",
        [KEYS.h1]: "Heading 1",
        [KEYS.h2]: "Heading 2",
        [KEYS.h3]: "Heading 3",
        [KEYS.h4]: "Heading 4",
      },
      query: ({ path }) => path.length === 1,
    },
  }),
];
