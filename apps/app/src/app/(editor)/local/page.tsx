import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import RichEditorShell from "@/components/rich-editor-shell";

export const metadata: Metadata = createMetadata({
  title: "local",
  description: "Editing note with code: local",
});

export default function NoSavePage() {
  return <RichEditorShell code="no-save" noSave />;
}
