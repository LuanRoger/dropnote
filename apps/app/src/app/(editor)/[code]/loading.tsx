import { Skeleton } from "@repo/design-system/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-3 p-2">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}
