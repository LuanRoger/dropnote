import { withProps } from "@udecode/cn";
import { ParagraphPlugin, PlateLeaf } from "@udecode/plate/react";
import { BlockquotePlugin } from "@udecode/plate-block-quote/react";
import {
  CodeBlockPlugin,
  CodeLinePlugin,
  CodeSyntaxPlugin,
} from "@udecode/plate-code-block/react";
import { HorizontalRulePlugin } from "@udecode/plate-horizontal-rule/react";
import { LinkPlugin } from "@udecode/plate-link/react";
import { TogglePlugin } from "@udecode/plate-toggle/react";
import { HeadingPlugin, TocPlugin } from "@udecode/plate-heading/react";
import { TodoListPlugin } from "@udecode/plate-list/react";
import { DatePlugin } from "@udecode/plate-date/react";
import {
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
} from "@udecode/plate-basic-marks/react";
import {
  BaseFontColorPlugin,
  BaseFontBackgroundColorPlugin,
} from "@udecode/plate-font";
import { HighlightPlugin } from "@udecode/plate-highlight/react";
import { KbdPlugin } from "@udecode/plate-kbd/react";
import { IndentPlugin } from "@udecode/plate-indent/react";
import { IndentListPlugin } from "@udecode/plate-indent-list/react";
import {
  BlockMenuPlugin,
} from "@udecode/plate-selection/react";
import { ExitBreakPlugin, SoftBreakPlugin } from "@udecode/plate-break/react";
import { NodeIdPlugin } from "@udecode/plate-node-id";
import { ResetNodePlugin } from "@udecode/plate-reset-node/react";
import { DeletePlugin } from "@udecode/plate-select";
import { TabbablePlugin } from "@udecode/plate-tabbable/react";
import { TrailingBlockPlugin } from "@udecode/plate-trailing-block";
import { BaseSlashPlugin } from "@udecode/plate-slash-command";
import { DocxPlugin } from "@udecode/plate-docx";
import { CsvPlugin } from "@udecode/plate-csv";
import { MarkdownPlugin } from "@udecode/plate-markdown";
import { JuicePlugin } from "@udecode/plate-juice";
import { HEADING_KEYS } from "@udecode/plate-heading";
import { FixedToolbarPlugin } from "@/components/editor/plugins/fixed-toolbar-plugin";

import { BlockquoteElement } from "@/components/plate-ui/blockquote-element";
import { CodeBlockElement } from "@/components/plate-ui/code-block-element";
import { CodeLineElement } from "@/components/plate-ui/code-line-element";
import { CodeSyntaxLeaf } from "@/components/plate-ui/code-syntax-leaf";
import { HrElement } from "@/components/plate-ui/hr-element";
import { LinkElement } from "@/components/plate-ui/link-element";
import { LinkFloatingToolbar } from "@/components/plate-ui/link-floating-toolbar";
import { ToggleElement } from "@/components/plate-ui/toggle-element";
import { HeadingElement } from "@/components/plate-ui/heading-element";
import { ParagraphElement } from "@/components/plate-ui/paragraph-element";
import { TodoListElement } from "@/components/plate-ui/todo-list-element";
import { DateElement } from "@/components/plate-ui/date-element";
import { CodeLeaf } from "@/components/plate-ui/code-leaf";
import { withPlaceholders } from "@/components/plate-ui/placeholder";
import { autoformatPlugin } from "@/components/editor/plugins/autoformater";
import { blockSelectionPlugins } from "@/components/editor/plugins/block-selection";
import { cursorOverlayPlugin } from "@/components/editor/plugins/cursor-plugin";

export const plugins = [
  BlockquotePlugin,
  CodeBlockPlugin,
  HorizontalRulePlugin,
  LinkPlugin.configure({
    render: { afterEditable: () => <LinkFloatingToolbar /> },
  }),
  TogglePlugin,
  ParagraphPlugin,
  HeadingPlugin,
  TodoListPlugin,
  DatePlugin,
  TocPlugin,
  BoldPlugin,
  ItalicPlugin,
  UnderlinePlugin,
  StrikethroughPlugin,
  CodePlugin,
  SubscriptPlugin,
  SuperscriptPlugin,
  BaseFontColorPlugin,
  BaseFontBackgroundColorPlugin,
  HighlightPlugin,
  KbdPlugin,
  IndentPlugin.configure({
    inject: { targetPlugins: ["p", "h1", "h2", "h3"] },
  }),
  IndentListPlugin.configure({
    inject: { targetPlugins: ["p", "h1", "h2", "h3"] },
  }),
  BlockMenuPlugin,
  ExitBreakPlugin.configure({
    options: {
      rules: [
        {
          hotkey: "mod+enter",
        },
        {
          before: true,
          hotkey: "mod+shift+enter",
        },
        {
          hotkey: "enter",
          level: 1,
          query: {
            allow: ["h1", "h2", "h3"],
            end: true,
            start: true,
          },
          relative: true,
        },
      ],
    },
  }),
  FixedToolbarPlugin,
  NodeIdPlugin,
  ResetNodePlugin.configure({
    options: {
      rules: [
        // Usage: https://platejs.org/docs/reset-node
      ],
    },
  }),
  DeletePlugin,
  SoftBreakPlugin.configure({
    options: {
      rules: [
        { hotkey: "shift+enter" },
        {
          hotkey: "enter",
          query: {
            allow: ["code_block", "blockquote", "td", "th"],
          },
        },
      ],
    },
  }),
  TabbablePlugin,
  TrailingBlockPlugin.configure({
    options: { type: "p" },
  }),
  BaseSlashPlugin,
  DocxPlugin,
  CsvPlugin,
  MarkdownPlugin,
  JuicePlugin,
  autoformatPlugin,
  ...blockSelectionPlugins,
  cursorOverlayPlugin,
];

export const override = {
  components: withPlaceholders({
    [BlockquotePlugin.key]: BlockquoteElement,
    [CodeBlockPlugin.key]: CodeBlockElement,
    [CodeLinePlugin.key]: CodeLineElement,
    [CodeSyntaxPlugin.key]: CodeSyntaxLeaf,
    [HorizontalRulePlugin.key]: HrElement,
    [LinkPlugin.key]: LinkElement,
    [TogglePlugin.key]: ToggleElement,
    [HEADING_KEYS.h1]: withProps(HeadingElement, { variant: "h1" }),
    [HEADING_KEYS.h2]: withProps(HeadingElement, { variant: "h2" }),
    [HEADING_KEYS.h3]: withProps(HeadingElement, { variant: "h3" }),
    [ParagraphPlugin.key]: ParagraphElement,
    [TodoListPlugin.key]: TodoListElement,
    [DatePlugin.key]: DateElement,
    [BoldPlugin.key]: withProps(PlateLeaf, { as: "strong" }),
    [CodePlugin.key]: CodeLeaf,
    [ItalicPlugin.key]: withProps(PlateLeaf, { as: "em" }),
    [StrikethroughPlugin.key]: withProps(PlateLeaf, { as: "s" }),
    [SubscriptPlugin.key]: withProps(PlateLeaf, { as: "sub" }),
    [SuperscriptPlugin.key]: withProps(PlateLeaf, { as: "sup" }),
    [UnderlinePlugin.key]: withProps(PlateLeaf, { as: "u" }),
  }),
};
