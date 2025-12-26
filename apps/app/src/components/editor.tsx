"use client";

import { Plate, useEditorSelector, usePlateEditor } from "@repo/editor";
import RichEditor from "@repo/editor/components/rich-editor";
import {
  EditorStateContext,
  EditorStateProvider,
} from "@repo/editor/contexts/editor-state";
import { EditorKit } from "@repo/editor/kits/editor-kit";
import { useCallback, useContext, useEffect, useRef } from "react";
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
      {noSave ? (
        <RichEditorEmpty />
      ) : (
        <EditorStateProvider>
          <RichEditorShell code={code} />
        </EditorStateProvider>
      )}
    </Plate>
  );
}

function RichEditorShell({ code }: { code: string }) {
  const noteBody = useEditorSelector((editor) => editor.children, []);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { isSaving, setIsSaving } = useContext(EditorStateContext);

  const debouncedSave = useCallback(
    (code: string, noteBody: any[]) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(async () => {
        setIsSaving(true);
        await updateNoteByCode(code, noteBody);
        setIsSaving(false);
      }, EDITOR_DEBOUNCE_TIME_MS);
    },
    [setIsSaving],
  );

  useEffect(() => {
    if (noteBody.length > 0) {
      debouncedSave(code, noteBody);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [noteBody, code, debouncedSave]);

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
