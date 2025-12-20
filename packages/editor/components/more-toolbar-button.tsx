"use client";

import {
  useLinkToolbarButton,
  useLinkToolbarButtonState,
} from "@platejs/link/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import {
  KeyboardIcon,
  LinkIcon,
  MoreHorizontalIcon,
  SubscriptIcon,
  SuperscriptIcon,
} from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef } from "platejs/react";
import { ComponentPropsWithoutRef, useState } from "react";
import { ToolbarButton } from "./toolbar";

export function MoreToolbarButton(
  props: ComponentPropsWithoutRef<typeof DropdownMenu>,
) {
  const editor = useEditorRef();
  const [open, setOpen] = useState(false);
  const stateLink = useLinkToolbarButtonState();
  const { props: buttonProps } = useLinkToolbarButton(stateLink);

  return (
    <DropdownMenu modal={false} onOpenChange={setOpen} open={open} {...props}>
      <DropdownMenuTrigger asChild>
        <ToolbarButton pressed={open} tooltip="Insert">
          <MoreHorizontalIcon />
        </ToolbarButton>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="ignore-click-outside/toolbar flex max-h-[500px] min-w-[180px] flex-col overflow-y-auto"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={buttonProps.onClick}>
            <LinkIcon />
            Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              editor.tf.toggleMark(KEYS.kbd);
              editor.tf.collapse({ edge: "end" });
              editor.tf.focus();
            }}
          >
            <KeyboardIcon />
            Keyboard input
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={() => {
              editor.tf.toggleMark(KEYS.sup, {
                remove: KEYS.sub,
              });
              editor.tf.focus();
            }}
          >
            <SuperscriptIcon />
            Superscript
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => {
              editor.tf.toggleMark(KEYS.sub, {
                remove: KEYS.sup,
              });
              editor.tf.focus();
            }}
          >
            <SubscriptIcon />
            Subscript
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
