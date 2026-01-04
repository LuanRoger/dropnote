"use client";

import { Plate, usePlateEditor } from "@repo/editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { EditorKit } from "@repo/editor/kits/editor-kit";
import { funAnimalName } from "fun-animal-names";
import { updateNoteByCode } from "@/app/actions/notes";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import { generateRandomHexColor } from "@/utils/color";
import RichEditorEmpty from "./rich-editor-empty";

interface RichEditorShellProps {
  code: string;
  initialValue?: any;
  wssUrl?: string;
}

export default function RichEditorShell({
  code,
  initialValue,
  wssUrl,
}: RichEditorShellProps) {
  const editor = usePlateEditor({
    plugins: EditorKit({
      yjs: {
        wssUrl: wssUrl ?? "",
        name: funAnimalName("Fun"),
        color: generateRandomHexColor(),
        roomName: code,
      },
    }),
    value: initialValue,
  });

  return (
    <Plate editor={editor}>
      <RichEditorChildren code={code} />
    </Plate>
  );
}

interface RichEditorChildrenProps {
  code: string;
}

function RichEditorChildren({ code }: RichEditorChildrenProps) {
  function saveNote(value: any) {
    return updateNoteByCode(code, value);
  }

  const { isSaving } = useEditorMechanisms({
    code,
    debounceTimeMs: EDITOR_DEBOUNCE_TIME_MS,
    onSave: saveNote,
  });

  return <RichEditorEmpty isLoading={isSaving} />;
}
