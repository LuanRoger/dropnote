import { ReactNode } from "react";

interface KeyboardKeyProps {
  children?: ReactNode;
}

export default function KeyboardKey({ children }: KeyboardKeyProps) {
  return (
    <kbd className="text-xs bg-muted rounded-sm p-1 border-gray border font-geist-mono">
      {children}
    </kbd>
  );
}
