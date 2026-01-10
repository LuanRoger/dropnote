"use client";

import { Plate, usePlateEditor } from "@repo/editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { EditorKit } from "@repo/editor/kits/editor-kit";
import { updateNoteByCode } from "@/app/actions/notes";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import { generateRandomHexColor } from "@/utils/color";
import { generateRandomName } from "@/utils/name";
import RichEditorEmpty from "./rich-editor-empty";

interface RichEditorShellProps {
  code: string;
  initialValue?: any;
  noSave?: boolean;
}

export default function RichEditorShell({
  code,
  initialValue,
  noSave,
}: RichEditorShellProps) {
  const wssUrl = noSave
    ? undefined
    : process.env.NEXT_PUBLIC_HOCUSPOCUS_WSS_URL;
  const yjsOptions = wssUrl
    ? {
        wssUrl,
        name: generateRandomName(),
        color: generateRandomHexColor(),
        roomName: code,
      }
    : undefined;
  const editor = usePlateEditor({
    plugins: EditorKit({
      yjs: yjsOptions,
    }),
    value: initialValue,
  });

  return (
    <Plate editor={editor}>
      {noSave ? <RichEditorEmpty /> : <RichEditorChildren code={code} />}
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
