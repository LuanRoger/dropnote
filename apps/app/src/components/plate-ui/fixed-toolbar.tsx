"use client";

import { cn } from "@/utils/tailwind";

import { Toolbar } from "./toolbar";

export function FixedToolbar(props: React.ComponentProps<typeof Toolbar>) {
  return (
    <Toolbar
      {...props}
      className={cn(
        "sticky top-0 left-0 z-50 scrollbar-hide w-full justify-between backdrop-blur-lg overflow-x-auto rounded-t-lg border-b border-b-border p-1",
        props.className,
      )}
    />
  );
}
