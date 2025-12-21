"use client";

import { LineHeightPlugin } from "@platejs/basic-styles/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { WrapText } from "lucide-react";
import { useEditorRef, useSelectionFragmentProp } from "platejs/react";
import { type ComponentPropsWithoutRef, useState } from "react";
import { ToolbarButton } from "./toolbar";

export function LineHeightToolbarButton(
  props: ComponentPropsWithoutRef<typeof DropdownMenu>
) {
  const editor = useEditorRef();
  const { defaultNodeValue, validNodeValues: values = [] } =
    editor.getInjectProps(LineHeightPlugin);

  const value = useSelectionFragmentProp({
    defaultValue: defaultNodeValue,
    getProp: (node) => node.lineHeight,
  });

  const [open, setOpen] = useState(false);

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen} open={open} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton isDropdown pressed={open} tooltip="Line height">
          <WrapText />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="min-w-0">
        <DropdownMenuRadioGroup
          onValueChange={(newValue) => {
            editor
              .getTransforms(LineHeightPlugin)
              .lineHeight.setNodes(Number(newValue));
            editor.tf.focus();
          }}
          value={value}
        >
          {values.map((value) => (
            <DropdownMenuRadioItem
              className="min-w-[180px] pl-2 *:first:[span]:hidden"
              key={value}
              value={value}
            >
              {value}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
