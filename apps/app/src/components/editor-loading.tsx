import { Skeleton } from "@repo/design-system/components/ui/skeleton";

export default function EditorLoading() {
  return (
    <div className="flex size-full flex-col items-center justify-center gap-3">
      <Skeleton className="h-12 w-full flex-none rounded-lg" />
      <Skeleton className="w-full flex-1 rounded-lg" />
      <Skeleton className="h-8 w-full flex-none rounded-lg" />
    </div>
  );
}
