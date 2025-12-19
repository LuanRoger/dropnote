"use client";

import {
  FloatingMedia as FloatingMediaPrimitive,
  FloatingMediaStore,
  useFloatingMediaValue,
  useImagePreviewValue,
} from "@platejs/media/react";
import {
  Button,
  buttonVariants,
} from "@repo/design-system/components/ui/button";
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@repo/design-system/components/ui/popover";
import { Separator } from "@repo/design-system/components/ui/separator";
import { cva } from "class-variance-authority";
import { Link, Trash2Icon } from "lucide-react";
import type { WithRequiredKey } from "platejs";
import {
  useEditorRef,
  useEditorSelector,
  useElement,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
} from "platejs/react";
import { CaptionButton } from "./caption";

const inputVariants = cva(
  "flex h-[28px] w-full rounded-md border-none bg-transparent px-1.5 py-1 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-transparent md:text-sm",
);

export function MediaToolbar({
  children,
  plugin,
}: {
  children: React.ReactNode;
  plugin: WithRequiredKey;
}) {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const selected = useSelected();

  const selectionCollapsed = useEditorSelector(
    (editor) => !editor.api.isExpanded(),
    [],
  );
  const isImagePreviewOpen = useImagePreviewValue("isOpen", editor.id);
  const isOpen =
    !readOnly && selected && selectionCollapsed && !isImagePreviewOpen;
  const isEditing = useFloatingMediaValue("isEditing");

  useEffect(() => {
    if (!isOpen && isEditing) {
      FloatingMediaStore.set("isEditing", false);
    }
  }, [isOpen]);

  const element = useElement();
  const { props: buttonProps } = useRemoveNodeButton({ element });

  if (readOnly) {
    return <>{children}</>;
  }

  return (
    <Popover modal={false} open={isOpen}>
      <PopoverAnchor>{children}</PopoverAnchor>

      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {isEditing ? (
          <div className="flex w-[330px] flex-col">
            <div className="flex items-center">
              <div className="flex items-center pr-1 pl-2 text-muted-foreground">
                <Link className="size-4" />
              </div>

              <FloatingMediaPrimitive.UrlInput
                className={inputVariants()}
                options={{ plugin }}
                placeholder="Paste the embed link..."
              />
            </div>
          </div>
        ) : (
          <div className="box-content flex items-center">
            <FloatingMediaPrimitive.EditButton
              className={buttonVariants({ size: "sm", variant: "ghost" })}
            >
              Edit link
            </FloatingMediaPrimitive.EditButton>

            <CaptionButton size="sm" variant="ghost">
              Caption
            </CaptionButton>

            <Separator className="mx-1 h-6" orientation="vertical" />

            <Button size="sm" variant="ghost" {...buttonProps}>
              <Trash2Icon />
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
