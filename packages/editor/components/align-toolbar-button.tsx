"use client";

import type { Alignment } from "@platejs/basic-styles";
import { TextAlignPlugin } from "@platejs/basic-styles/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
} from "lucide-react";
import { useEditorPlugin, useSelectionFragmentProp } from "platejs/react";
import { useState } from "react";

import { ToolbarButton } from "./toolbar";

const items = [
  {
    label: "Left",
    icon: AlignLeftIcon,
    value: "left",
  },
  {
    label: "Center",
    icon: AlignCenterIcon,
    value: "center",
  },
  {
    label: "Right",
    icon: AlignRightIcon,
    value: "right",
  },
  {
    label: "Justify",
    icon: AlignJustifyIcon,
    value: "justify",
  },
];

export function AlignToolbarButton(
  props: React.ComponentProps<typeof DropdownMenu>
) {
  const { editor, tf } = useEditorPlugin(TextAlignPlugin);
  const value =
    useSelectionFragmentProp({
      defaultValue: "start",
      getProp: (node) => node.align,
    }) ?? "left";

  const [open, setOpen] = useState(false);
  const IconValue =
    items.find((item) => item.value === value)?.icon ?? AlignLeftIcon;

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen} open={open} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={open} tooltip="Align">
          <IconValue />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          onValueChange={(value) => {
            tf.textAlign.setNodes(value as Alignment);
            editor.tf.focus();
          }}
          value={value}
        >
          {items.map(({ label, icon: Icon, value: itemValue }) => (
            <DropdownMenuRadioItem
              className="data-[state=checked]:bg-accent *:first:[span]:hidden"
              key={itemValue}
              value={itemValue}
            >
              <Icon />
              {label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
