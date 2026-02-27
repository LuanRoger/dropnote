"use client";

import { Plate } from "@repo/editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { createEditor } from "@repo/editor/kits/editor-kit";
import type { EditorOptions } from "@repo/editor/types/editor";
import type { NoteBody, NotesSaveSource } from "@repo/editor/types/notes";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import { createNoteSource } from "@/lib/sources/notes";
import RichEditorEmpty from "./rich-editor-empty";

type RichEditorShellProps = {
  code: string;
  initialValue?: NoteBody;
  noteSource?: NoteBody;
  options: EditorOptions;
};

export default function RichEditorShell({
  code,
  noteSource,
  initialValue,
  options,
}: RichEditorShellProps) {
  const source = noteSource ? createNoteSource(code, noteSource) : undefined;

  const editor = createEditor(options, initialValue);

  return (
    <Plate editor={editor}>
      {source ? <RichEditorChildren source={source} /> : <RichEditorEmpty />}
    </Plate>
  );
}

type RichEditorChildrenProps = {
  source: NotesSaveSource;
};

function RichEditorChildren({ source }: RichEditorChildrenProps) {
  const { isSaving } = useEditorMechanisms({
    source,
    debounceTimeMs: EDITOR_DEBOUNCE_TIME_MS,
  });

  return <RichEditorEmpty isLoading={isSaving} />;
}
