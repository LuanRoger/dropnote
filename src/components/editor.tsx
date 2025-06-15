"use client";

import { Plate, useEditorSelector, usePlateEditor } from "platejs/react";
import { EditorKit } from "./editor/editor-kit";
import RichEditor from "./rich-editor";
import { updateNoteByCode } from "@/app/actions/notes";
import { useCallback, useContext, useEffect, useRef } from "react";
import {
  EditorStateContext,
  EditorStateProvider,
} from "@/contexts/editor-state";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";

interface EditorProps {
  code: string;
  initialValue?: any[];
  readOnly?: boolean;
}

export default function Editor({
  code,
  initialValue,
  readOnly = false,
}: EditorProps) {
  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue,
  });

  return (
    <Plate editor={editor} readOnly={readOnly}>
      <EditorStateProvider>
        <RichEditorShell code={code} />
      </EditorStateProvider>
    </Plate>
  );
}

function RichEditorShell({ code }: { code: string }) {
  const noteBody = useEditorSelector((editor) => editor.children, []);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const { setIsSaving } = useContext(EditorStateContext);

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

  return <RichEditor className="h-full" />;
}
