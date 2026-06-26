import { cn } from "@/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn("shimmer rounded-lg", className)}
      aria-hidden="true"
    />
  );
}

export function MovieCardSkeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="aspect-poster rounded-xl shimmer" />
      <div className="mt-3 space-y-2 px-0.5">
        <Skeleton className="h-4 w-4/5" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </div>
  );
}

export function MovieGridSkeleton({
  count = 10,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4",
        className
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="relative w-full h-[85vh] bg-zinc-900 animate-pulse">
      <div className="absolute inset-0 shimmer" />
      <div className="absolute bottom-16 left-8 lg:left-16 space-y-4 max-w-xl">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-4 w-80" />
        <div className="flex gap-4 mt-6">
          <Skeleton className="h-12 w-36 rounded-xl" />
          <Skeleton className="h-12 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MovieDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-[60vh] shimmer" />
      <div className="max-w-screen-2xl mx-auto px-4 py-8 space-y-8">
        <div className="flex gap-8">
          <Skeleton className="w-48 h-72 rounded-xl shrink-0" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <div className="flex gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
