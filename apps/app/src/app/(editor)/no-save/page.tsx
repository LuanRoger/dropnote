import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import RichEditorShell from "@/components/rich-editor-shell";

export const metadata: Metadata = createMetadata({
  title: "no-save",
  description: "Editing note with code: no-save",
});

export default function NoSavePage() {
  return <RichEditorShell code="no-save" />;
}
