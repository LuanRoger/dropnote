import { type AnyPluginConfig, TrailingBlockPlugin } from "platejs";
import { createPlateEditor } from "platejs/react";

import { AlignKit } from "../plugins/align-kit";
import { AutoformatKit } from "../plugins/autoformat-kit";
import { BasicBlocksKit } from "../plugins/basic-blocks-kit";
import { BasicMarksKit } from "../plugins/basic-marks-kit";
import { BlockMenuKit } from "../plugins/block-menu-kit";
import { BlockPlaceholderKit } from "../plugins/block-placeholder-kit";
import { BlockSelectionKit } from "../plugins/block-selection-kit";
import { BottomStatusPlugin } from "../plugins/bottom-status-plugin";
import { CalloutKit } from "../plugins/callout-kit";
import { CodeBlockKit } from "../plugins/code-block-kit";
import { ColumnKit } from "../plugins/column-kit";
import { CursorOverlayKit } from "../plugins/cursor-overlay-kit";
import { DateKit } from "../plugins/date-kit";
import { DndKit } from "../plugins/dnd-kit";
import { DocxKit } from "../plugins/docx-kit";
import { EmojiKit } from "../plugins/emoji-kit";
import { ExitBreakKit } from "../plugins/exit-break-kit";
import { FixedToolbarKit } from "../plugins/fixed-toolbar-kit";
import { FloatingToolbarKit } from "../plugins/floating-toolbar-kit";
import { FontKit } from "../plugins/font-kit";
import { LineHeightKit } from "../plugins/line-height-kit";
import { LinkKit } from "../plugins/link-kit";
import { ListKit } from "../plugins/list-kit";
import { MarkdownKit } from "../plugins/markdown-kit";
import { MathKit } from "../plugins/math-kit";
import { MediaKit } from "../plugins/media-kit";
import { SlashKit } from "../plugins/slash-kit";
import { TableKit } from "../plugins/table-kit";
import { TocKit } from "../plugins/toc-kit";
import { ToggleKit } from "../plugins/toggle-kit";
import { YjsKit } from "../plugins/yjs-kit";
import { DocxExportKit } from "../plugins/docx-export-kit";

import { BaseBasicBlocksKit } from "../plugins/basic-blocks-base-kit";
import { BaseBasicMarksKit } from "../plugins/basic-marks-base-kit";
import { BaseCalloutKit } from "../plugins/callout-base-kit";
import { BaseCodeBlockKit } from "../plugins/code-block-base-kit";
import { BaseColumnKit } from "../plugins/column-base-kit";
import { BaseDateKit } from "../plugins/date-base-kit";
import { BaseFontKit } from "../plugins/font-base-kit";
import { BaseLineHeightKit } from "../plugins/line-height-base-kit";
import { BaseLinkKit } from "../plugins/link-base-kit";
import { BaseListKit } from "../plugins/list-base-kit";
import { BaseMathKit } from "../plugins/math-base-kit";
import { BaseMediaKit } from "../plugins/media-base-kit";
import { BaseTableKit } from "../plugins/table-base-kit";
import { BaseTocKit } from "../plugins/toc-base-kit";
import { BaseToggleKit } from "../plugins/toggle-base-kit";
import { BaseAlignKit } from "../plugins/align-base-kit";

import type { Badge } from "../types/badge";
import type { EditorOptions } from "../types/editor";
import type { NoteBody } from "../types/notes";

type EditorKitOptions = {
  yjs?: {
    name: string;
    color: string;
    roomName: string;
    wssUrl: string;
    token: string;
  };
  bottomStatus?: {
    maxLength: number;
    expireAt?: Date;
    badges: Badge[];
  };
};

export const StaticEditorKit: AnyPluginConfig[] = [
  // Elements
  ...BaseBasicBlocksKit,
  ...BaseCodeBlockKit,
  ...BaseTableKit,
  ...BaseToggleKit,
  ...BaseTocKit,
  ...BaseMediaKit,
  ...BaseCalloutKit,
  ...BaseColumnKit,
  ...BaseMathKit,
  ...BaseDateKit,
  ...BaseLinkKit,

  // Marks
  ...BaseBasicMarksKit,
  ...BaseFontKit,

  // Block style
  ...BaseListKit,
  ...BaseAlignKit,
  ...BaseLineHeightKit,
];

export const BasicEditorKit: AnyPluginConfig[] = [
  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Style
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...BlockSelectionKit,
  ...CursorOverlayKit,
  ...DndKit,
  ...BlockMenuKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...DocxExportKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,
];

export const EditorKit: (options: EditorKitOptions) => AnyPluginConfig[] = (
  options: EditorKitOptions,
) => {
  const { yjs, bottomStatus } = options;

  const kits = [
    ...BasicEditorKit,
    BottomStatusPlugin.configure({
      options: bottomStatus,
    }),
  ];

  if (yjs) {
    kits.push(...YjsKit(yjs));
  }

  return kits;
};

export function createEditor(options: EditorOptions, initialValue: NoteBody) {
  const { maxLength, badges = [], colabration, expireAt } = options;

  return createPlateEditor({
    plugins: EditorKit({
      yjs: colabration,
      bottomStatus: {
        maxLength,
        expireAt,
        badges,
      },
    }),
    value: initialValue,
    maxLength,
  });
}
