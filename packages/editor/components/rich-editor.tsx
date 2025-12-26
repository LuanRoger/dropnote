import { Editor, EditorContainer } from "./editor";

export type RichEditorProps = {
  className?: string;
};

export default function RichEditor({ className }: RichEditorProps) {
  return (
    <EditorContainer className={className} variant="minimal">
      <Editor variant="minimal" />
    </EditorContainer>
  );
}
