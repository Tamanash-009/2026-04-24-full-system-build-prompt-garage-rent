import { Skeleton } from "@/components/ui/skeleton";

export default function AppRoutesLoading() {
  return (
    <div className="grid gap-6">
      <Skeleton className="h-28 w-full" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
        <Skeleton className="h-44 w-full" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-[340px] w-full" />
        <Skeleton className="h-[340px] w-full" />
      </div>
    </div>
  );
}
