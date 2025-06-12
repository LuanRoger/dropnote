"use client";

import React from "react";

import {
  BoldPlugin,
  CodePlugin,
  ItalicPlugin,
  StrikethroughPlugin,
  UnderlinePlugin,
} from "@udecode/plate-basic-marks/react";
import { ImagePlugin } from "@udecode/plate-media/react";
import { useEditorReadOnly } from "@udecode/plate/react";
import {
  ArrowUpToLineIcon,
  BoldIcon,
  Code2Icon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon,
} from "lucide-react";

import { MoreDropdownMenu } from "@/components/plate-ui/more-dropdown-menu";

import { EmojiDropdownMenu } from "./emoji-dropdown-menu";
import { ExportToolbarButton } from "./export-toolbar-button";
import {
  BulletedIndentListToolbarButton,
  NumberedIndentListToolbarButton,
} from "./indent-list-toolbar-button";
import { InsertDropdownMenu } from "./insert-dropdown-menu";
import { LinkToolbarButton } from "./link-toolbar-button";
import { MarkToolbarButton } from "./mark-toolbar-button";
import { MediaToolbarButton } from "./media-toolbar-button";
import { ToggleToolbarButton } from "./toggle-toolbar-button";
import { ToolbarGroup } from "./toolbar";
import { TurnIntoDropdownMenu } from "./turn-into-dropdown-menu";

export function FixedToolbarButtons() {
  const readOnly = useEditorReadOnly();

  return (
    <div className="flex w-full">
      {!readOnly && (
        <>
          {/* <ToolbarGroup>
            <UndoToolbarButton />
            <RedoToolbarButton />
          </ToolbarGroup> */}

          <ToolbarGroup>
            <InsertDropdownMenu />
            <TurnIntoDropdownMenu />
            {/* <FontSizeToolbarButton /> */}
          </ToolbarGroup>

          <ToolbarGroup>
            <MarkToolbarButton nodeType={BoldPlugin.key} tooltip="Bold (⌘+B)">
              <BoldIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={ItalicPlugin.key}
              tooltip="Italic (⌘+I)"
            >
              <ItalicIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={UnderlinePlugin.key}
              tooltip="Underline (⌘+U)"
            >
              <UnderlineIcon />
            </MarkToolbarButton>

            <MarkToolbarButton
              nodeType={StrikethroughPlugin.key}
              tooltip="Strikethrough (⌘+⇧+M)"
            >
              <StrikethroughIcon />
            </MarkToolbarButton>

            <MarkToolbarButton nodeType={CodePlugin.key} tooltip="Code (⌘+E)">
              <Code2Icon />
            </MarkToolbarButton>

            {/* <ColorDropdownMenu
              nodeType={FontColorPlugin.key}
              tooltip="Text color"
            >
              <BaselineIcon />
            </ColorDropdownMenu>

            <ColorDropdownMenu
              nodeType={FontBackgroundColorPlugin.key}
              tooltip="Background color"
            >
              <PaintBucketIcon />
            </ColorDropdownMenu> */}
          </ToolbarGroup>

          <ToolbarGroup>
            {/* <AlignDropdownMenu /> */}

            <NumberedIndentListToolbarButton />
            <BulletedIndentListToolbarButton />
            {/* <IndentTodoToolbarButton /> */}
            <ToggleToolbarButton />
          </ToolbarGroup>

          <ToolbarGroup>
            <MediaToolbarButton nodeType={ImagePlugin.key} />
            <LinkToolbarButton />
            {/* <TableDropdownMenu /> */}
            <EmojiDropdownMenu />
          </ToolbarGroup>

          {/* <ToolbarGroup>
            <LineHeightDropdownMenu />
            <OutdentToolbarButton />
            <IndentToolbarButton />
          </ToolbarGroup> */}

          <ToolbarGroup>
            <MoreDropdownMenu />
          </ToolbarGroup>
        </>
      )}

      <div className="grow" />

      <ToolbarGroup>
        <ExportToolbarButton>
          <ArrowUpToLineIcon />
        </ExportToolbarButton>

        {/* <ImportToolbarButton /> */}
      </ToolbarGroup>
    </div>
  );
}
