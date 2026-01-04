import RichEditor from "@repo/editor/components/rich-editor";
import LoadingSpinner from "./loading-spinner";

export interface RichEditorEmptyProps {
  isLoading?: boolean;
}

export default function RichEditorEmpty({ isLoading }: RichEditorEmptyProps) {
  return (
    <div className="relative size-full">
      <LoadingSpinner className="absolute right-2 bottom-2" show={isLoading} />
      <RichEditor />
    </div>
  );
}
