import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="section-shell flex min-h-screen items-center justify-center py-16">
      <div className="grid w-full max-w-4xl gap-6">
        <Skeleton className="h-16 w-48" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
          <Skeleton className="h-44 w-full" />
        </div>
      </div>
    </div>
  );
}
