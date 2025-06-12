"use client";

import { useCreateEditor } from "@/components/editor/use-create-editor";
import RichEditor from "@/components/rich-editor";

export default function Page() {
  const editor = useCreateEditor();

  return (
    <div className="h-screen w-full" data-registry="plate">
      <RichEditor editor={editor} readOnly={false} className="h-full" />
    </div>
  );
}
