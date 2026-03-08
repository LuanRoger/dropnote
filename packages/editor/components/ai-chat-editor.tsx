"use client";

import * as React from "react";

import { useAIChatEditor } from "@platejs/ai/react";
import { usePlateEditor } from "platejs/react";

import { BasicEditorKit } from "../kits/basic-editor-kit";

import { EditorStatic } from "./editor-static";

export const AIChatEditor = React.memo(function AIChatEditor({
  content,
}: {
  content: string;
}) {
  const aiEditor = usePlateEditor({
    plugins: BasicEditorKit,
  });

  const value = useAIChatEditor(aiEditor, content);

  return <EditorStatic variant="aiChat" editor={aiEditor} value={value} />;
});
