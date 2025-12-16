import { Skeleton } from "@repo/design-system/components/ui/skeleton";

export default function LoadingPage() {
  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen w-full p-2">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-full w-full rounded-lg" />
    </div>
  );
}
