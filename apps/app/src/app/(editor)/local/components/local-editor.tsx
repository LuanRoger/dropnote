"use client";

import type { NoteBody } from "@repo/editor/types/notes";
import { useEffect, useState } from "react";
import EditorLoading from "@/components/editor-loading";
import RichEditorShell from "@/components/rich-editor-shell";
import { NotesLocalLoadSource } from "@/lib/sources/notes";
import { MAX_LENGHT_BASIC_NOTE } from "@/constants";

interface LocalEditorProps {
  code: string;
}

export default function LocalEditor({ code }: LocalEditorProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initialValue, setInitialValue] = useState<NoteBody>();

  useEffect(() => {
    const loader = new NotesLocalLoadSource(code);

    loader.load().then((loadedValue) => {
      setInitialValue(loadedValue);
      setIsLoading(false);
    });
  }, [code]);

  if (isLoading) {
    return <EditorLoading />;
  }

  return (
    <RichEditorShell
      code="local"
      initialValue={initialValue}
      maxLength={MAX_LENGHT_BASIC_NOTE}
      noteSource="local"
    />
  );
}
