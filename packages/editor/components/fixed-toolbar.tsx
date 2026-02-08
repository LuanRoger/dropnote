"use client";

import { cn } from "@repo/design-system/lib/utils";

import { Toolbar } from "./toolbar";

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        "scrollbar-hide sticky top-0 left-0 z-50 w-full justify-between overflow-x-auto rounded-lg border border-border p-1",
        props.className
      )}
    />
  );
}
