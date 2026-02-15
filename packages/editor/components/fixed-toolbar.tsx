"use client";

import { cn } from "@repo/design-system/lib/utils";

import { Toolbar } from "./toolbar";

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        "scrollbar-hide flex-none w-full justify-between overflow-x-auto rounded-md border border-border p-1",
        props.className,
      )}
    />
  );
}
