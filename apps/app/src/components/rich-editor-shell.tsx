"use client";

import { Plate } from "@repo/editor";
import { useEditorMechanisms } from "@repo/editor/hooks/use-editor-mechanisms";
import { createEditor } from "@repo/editor/kits/editor-kit";
import type { EditorOptions } from "@repo/editor/types/editor";
import type { NoteBody, NotesSaveSource } from "@repo/editor/types/notes";
import { useEffect, useState } from "react";
import { EDITOR_DEBOUNCE_TIME_MS } from "@/constants";
import { createNoteSource } from "@/lib/sources/notes";
import RichEditorEmpty from "./rich-editor-empty";
import UpgradeDialog from "./upgrade-dialog";

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
  const { upgradeButtonHref } = options;
  const upgradeHref = `${code}/upgrade`;

  return (
    <Plate editor={editor}>
      {source ? (
        <RichEditorChildren
          showUpgradeDialog={Boolean(upgradeButtonHref)}
          source={source}
          upgradeHref={upgradeHref}
        />
      ) : (
        <RichEditorEmpty />
      )}
    </Plate>
  );
}

type RichEditorChildrenProps = {
  source: NotesSaveSource;
  upgradeHref: string;
  showUpgradeDialog: boolean;
};

function RichEditorChildren({
  source,
  upgradeHref,
  showUpgradeDialog,
}: RichEditorChildrenProps) {
  const { isSaving } = useEditorMechanisms({
    source,
    debounceTimeMs: EDITOR_DEBOUNCE_TIME_MS,
  });
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);

  // TODO: Uncomment when Stripe is ready
  // useEffect(() => {
  //   if (!showUpgradeDialog) {
  //     return;
  //   }

  //   setIsUpgradeDialogOpen(true);
  // }, [showUpgradeDialog]);

  return (
    <>
      <UpgradeDialog
        onOpenChange={setIsUpgradeDialogOpen}
        open={isUpgradeDialogOpen}
        upgradeHref={upgradeHref}
      />
      <RichEditorEmpty isLoading={isSaving} />
    </>
  );
}
