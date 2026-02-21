import { createMetadata } from "@repo/seo/metadata";
import type { Metadata } from "next";
import RichEditorShell from "@/components/rich-editor-shell";
import { BADGES_DATA, MAX_LENGHT_BASIC_NOTE } from "@/constants";

const code = "no-save";
export const metadata: Metadata = createMetadata({
  title: code,
  description: `Editing note with code: ${code}`,
});

export default function NoSavePage() {
  return (
    <RichEditorShell
      code={code}
      options={{
        maxLength: MAX_LENGHT_BASIC_NOTE,
        badges: [BADGES_DATA.NO_SAVE],
      }}
    />
  );
}
