"use client";

import emojiMartData from "@emoji-mart/data";
import { EmojiInputPlugin, EmojiPlugin } from "@platejs/emoji/react";

import { EmojiInputElement } from "../components/emoji-node";

export const EmojiKit = [
  EmojiPlugin.configure({
    // biome-ignore lint/suspicious/noExplicitAny: The type of emojiMartData is complex and depends on the version of emoji-mart, so we use any here for simplicity.
    options: { data: emojiMartData as any },
  }),
  EmojiInputPlugin.withComponent(EmojiInputElement),
];
