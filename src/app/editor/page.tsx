"use client";

import RichEditor from "@/components/rich-editor";

import { EditorKit } from "@/components/editor/editor-kit";
import { usePlateEditor } from "platejs/react";

export default function Page() {
  const editor = usePlateEditor({
    plugins: EditorKit,
  });

  return (
    <div className="h-screen w-full" data-registry="plate">
      <RichEditor editor={editor} readOnly={false} className="h-full" />
    </div>
  );
}
