"use client";

import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import LoadingSpinner from "./loading-spinner";
import { useContext } from "react";
import { EditorStateContext } from "@/contexts/editor-state";

export interface RichEditorProps {
  className?: string;
}

export default function RichEditor({ className }: RichEditorProps) {
  const { isSaving } = useContext(EditorStateContext);

  return (
    <EditorContainer variant={"demo"} className={className}>
      {isSaving && <LoadingSpinner />}
      <Editor variant={"demo"} />
    </EditorContainer>
  );
}
