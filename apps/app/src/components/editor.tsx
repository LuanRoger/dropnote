"use client";

import { Plate, usePlateEditor } from "@repo/editor";
import RichEditor from "@repo/editor/components/rich-editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { EditorKit } from "@repo/editor/kits/editor-kit";
import { updateNoteByCode } from "@/app/actions/notes";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import LoadingSpinner from "./loading-spinner";

type EditorProps = {
  code: string;
  initialValue?: any[];
  readOnly?: boolean;
  noSave?: boolean;
};

export default function Editor({
  code,
  initialValue,
  readOnly = false,
  noSave = false,
}: EditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue,
  });

  return (
    <Plate editor={editor} readOnly={readOnly}>
      {noSave ? <RichEditorEmpty /> : <RichEditorShell code={code} />}
    </Plate>
  );
}

function RichEditorShell({ code }: { code: string; editor: EditorAny }) {
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

function RichEditorEmpty({ isLoading }: { isLoading?: boolean }) {
  return (
    <div className="relative size-full">
      <LoadingSpinner className="absolute right-2 bottom-2" show={isLoading} />
      <RichEditor />
    </div>
  );
}
