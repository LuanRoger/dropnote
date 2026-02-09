import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import RichEditorShell from "@/components/rich-editor-shell";

const code = "no-save";
export const metadata: Metadata = createMetadata({
  title: code,
  description: `Editing note with code: ${code}`,
});

export default function NoSavePage() {
  return <RichEditorShell code={code} />;
}
