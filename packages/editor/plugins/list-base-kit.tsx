import { BaseListPlugin } from "@platejs/list";
import { KEYS } from "platejs";
import { BlockListStatic } from "../components/block-list-static";
import { BaseIndentKit } from "../plugins/indent-base-kit";

export const BaseListKit = [
  ...BaseIndentKit,
  BaseListPlugin.configure({
    inject: {
      targetPlugins: [
        ...KEYS.heading,
        KEYS.p,
        KEYS.blockquote,
        KEYS.codeBlock,
        KEYS.toggle,
      ],
    },
    render: {
      belowNodes: BlockListStatic,
    },
  }),
];
