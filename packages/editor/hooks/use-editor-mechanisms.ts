import { YjsPlugin } from "@platejs/yjs/react";
import { useEditorSelector } from "platejs/react";
import { useEffect, useTransition } from "react";
import { useDebounce } from "./use-debounce";
import { useMounted } from "./use-mounted";

export function useEditorMechanisms({
  code,
  debounceTimeMs,
  onSave,
}: {
  code: string;
  debounceTimeMs: number;
  onSave: (value: any) => Promise<void>;
}) {
  const noteBody = useEditorSelector((editor) => editor.children, []);
  const getApi = useEditorSelector((editor) => editor.getApi, []);
  const mounted = useMounted();
  const toSaveValue = useDebounce(noteBody, debounceTimeMs);
  const [isSaving, performSave] = useTransition();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is to be trigger only on mount/unmount
  useEffect(() => {
    if (!mounted) {
      return;
    }

    getApi(YjsPlugin).yjs.init({
      id: code,
      value: noteBody,
    });

    return () => {
      getApi(YjsPlugin).yjs.destroy();
    };
  }, [getApi, mounted, code]);

  useEffect(() => {
    performSave(async () => {
      await onSave(toSaveValue);
    });
  }, [toSaveValue, onSave]);

  return {
    isSaving,
  };
}
