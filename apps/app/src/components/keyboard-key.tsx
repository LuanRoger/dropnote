import type { ReactNode } from "react";

interface KeyboardKeyProps {
  children?: ReactNode;
}

export default function KeyboardKey({ children }: KeyboardKeyProps) {
  return (
    <kbd className="rounded-sm border border-gray bg-muted p-1 font-geist-mono text-xs">
      {children}
    </kbd>
  );
}
