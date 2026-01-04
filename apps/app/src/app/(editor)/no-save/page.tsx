import RichEditorEmpty from "@/components/rich-editor-empty";

export const metadata: Metadata = createMetadata({
  title: "no-save",
  description: "Editing note with code: no-save",
});

export default function NoSavePage() {
  return <RichEditorEmpty />;
}
