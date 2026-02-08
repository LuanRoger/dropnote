"use client";

import { Plate, usePlateEditor } from "@repo/editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { EditorKit } from "@repo/editor/kits/editor-kit";
import type { NoteBody, NotesSource } from "@repo/editor/types/notes";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import { createNoteSource, type NoteSource } from "@/lib/sources/notes";
import { generateRandomHexColor } from "@/utils/color";
import { generateRandomName } from "@/utils/name";
import RichEditorEmpty from "./rich-editor-empty";

interface RichEditorShellProps {
  code: string;
  noteSource?: NoteSource;
  initialValue?: NoteBody;
  wssUrl?: string;
}

export default function RichEditorShell({
  code,
  noteSource,
  initialValue,
  wssUrl,
}: RichEditorShellProps) {
  const yjsOptions = wssUrl
    ? {
        wssUrl,
        name: generateRandomName(),
        color: generateRandomHexColor(),
        roomName: code,
      }
    : undefined;
  const source = noteSource ? createNoteSource(code, noteSource) : undefined;

  const editor = usePlateEditor({
    plugins: EditorKit({
      yjs: yjsOptions,
    }),
    value: initialValue,
  });

  return (
    <Plate editor={editor}>
      {source ? <RichEditorChildren source={source} /> : <RichEditorEmpty />}
    </Plate>
  );
}

interface RichEditorChildrenProps {
  source: NotesSource;
}

function RichEditorChildren({ source }: RichEditorChildrenProps) {
  const { isSaving } = useEditorMechanisms({
    source,
    debounceTimeMs: EDITOR_DEBOUNCE_TIME_MS,
  });

  return <RichEditorEmpty isLoading={isSaving} />;
}
