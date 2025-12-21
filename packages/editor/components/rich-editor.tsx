import { Editor, EditorContainer } from "./editor";

export type RichEditorProps = {
  className?: string;
};

export default function RichEditor({ className }: RichEditorProps) {
  return (
    <EditorContainer className={className}>
      <Editor variant={"fullWidth"} />
    </EditorContainer>
  );
}
