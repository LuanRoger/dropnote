import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export interface RichEditorProps {
  className?: string;
}

export default function RichEditor({ className }: RichEditorProps) {
  return (
    <EditorContainer className={className}>
      <Editor variant={"fullWidth"} />
    </EditorContainer>
  );
}
