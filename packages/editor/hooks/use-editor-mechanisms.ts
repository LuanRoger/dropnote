import { YjsPlugin } from "@platejs/yjs/react";
import { handleError } from "@repo/design-system/lib/utils";
import { useEditorSelector } from "platejs/react";
import { useCallback, useEffect, useTransition } from "react";
import { useDebounce } from "react-haiku";
import type { NotesSaveSource } from "../types/notes";
import { useMounted } from "./use-mounted";

export type UseEditorMechanismsProps = {
  source: NotesSaveSource;
  debounceTimeMs: number;
};

export function useEditorMechanisms({
  source,
  debounceTimeMs,
}: UseEditorMechanismsProps) {
  const code = source.code;

  const noteBody = useEditorSelector((editor) => editor.children, []);
  const getApi = useEditorSelector((editor) => editor.getApi, []);
  const mounted = useMounted();
  const toSaveValue = useDebounce(noteBody, debounceTimeMs);
  const saveNote = useCallback(
    () => source.save(toSaveValue),
    [toSaveValue, source]
  );
  const [isSaving, performSave] = useTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is to be trigger only on mount/unmount and change of code
  useEffect(() => {
    if (!mounted) {
      return;
    }

    getApi(YjsPlugin).yjs?.init({
      id: code,
      value: noteBody,
    });

    return () => {
      getApi(YjsPlugin).yjs?.destroy();
    };
  }, [getApi, mounted, code]);

  useEffect(() => {
    performSave(async () => {
      try {
        await saveNote();
      } catch (error) {
        handleError(error);
      }
    });
  }, [saveNote]);

  return {
    isSaving,
  };
}
