"use client";

import { Plate } from "@repo/editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { createEditor } from "@repo/editor/kits/editor-kit";
import type { Badge } from "@repo/editor/types/badge";
import type { NoteBody, NotesSaveSource } from "@repo/editor/types/notes";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import { createNoteSource } from "@/lib/sources/notes";
import type { NoteSource } from "@/lib/sources/types";
import { generateRandomHexColor } from "@/utils/color";
import { generateRandomName } from "@/utils/name";
import RichEditorEmpty from "./rich-editor-empty";

interface RichEditorShellProps {
  code: string;
  maxLength: number;
  noteSource?: NoteSource;
  initialValue?: NoteBody;
  wssUrl?: string;
  expireAt?: Date;
  badges?: Badge[];
}

export default function RichEditorShell({
  code,
  maxLength,
  noteSource,
  initialValue,
  wssUrl,
  expireAt,
  badges = [],
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

  const editor = createEditor(
    {
      yjs: yjsOptions,
      bottomStatus: {
        maxLength,
        expireAt,
        badges,
      },
    },
    initialValue,
  );

  return (
    <Plate editor={editor}>
      {source ? <RichEditorChildren source={source} /> : <RichEditorEmpty />}
    </Plate>
  );
}

interface RichEditorChildrenProps {
  source: NotesSaveSource;
}

function RichEditorChildren({ source }: RichEditorChildrenProps) {
  const { isSaving } = useEditorMechanisms({
    source,
    debounceTimeMs: EDITOR_DEBOUNCE_TIME_MS,
  });

  return <RichEditorEmpty isLoading={isSaving} />;
}
