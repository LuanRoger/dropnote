import { Plate, PlateEditor } from "@udecode/plate/react";

import { Editor, EditorContainer } from "@/components/plate-ui/editor";

export interface RichEditorProps {
  editor: PlateEditor;
  readOnly?: boolean;
  className?: string;
}

export default function RichEditor({
  editor,
  readOnly = false,
  className,
}: RichEditorProps) {
  return (
    <Plate editor={editor} readOnly={readOnly}>
      <EditorContainer variant={"demo"} className={className}>
        <Editor variant={"demo"} />
      </EditorContainer>
    </Plate>
  );
}
