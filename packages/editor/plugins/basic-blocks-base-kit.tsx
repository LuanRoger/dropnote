import {
  BaseBlockquotePlugin,
  BaseH1Plugin,
  BaseH2Plugin,
  BaseH3Plugin,
  BaseHorizontalRulePlugin,
} from "@platejs/basic-nodes";
import { BaseParagraphPlugin } from "platejs";

import { BlockquoteElementStatic } from "../components/blockquote-node-static";
import {
  H1ElementStatic,
  H2ElementStatic,
  H3ElementStatic,
} from "../components/heading-node-static";
import { HrElementStatic } from "../components/hr-node-static";
import { ParagraphElementStatic } from "../components/paragraph-node-static";

export const BaseBasicBlocksKit = [
  BaseParagraphPlugin.withComponent(ParagraphElementStatic),
  BaseH1Plugin.withComponent(H1ElementStatic),
  BaseH2Plugin.withComponent(H2ElementStatic),
  BaseH3Plugin.withComponent(H3ElementStatic),
  BaseBlockquotePlugin.withComponent(BlockquoteElementStatic),
  BaseHorizontalRulePlugin.withComponent(HrElementStatic),
];
