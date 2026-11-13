/** Skeleton loading primitives (shimmer style). */

export function Skeleton({ className = '' }: { className?: string }) {
  return <div className={'skeleton ' + className} />;
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div className={'card p-5 ' + className}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="mt-4 h-8 w-28" />
      <Skeleton className="mt-3 h-2.5 w-full" />
      <Skeleton className="mt-2 h-2.5 w-3/4" />
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 px-3 py-3.5">
      <Skeleton className="h-4 w-4 rounded" />
      <Skeleton className="h-8 w-8 rounded-lg" />
      <Skeleton className="h-3 flex-1" />
      <Skeleton className="hidden h-3 w-16 sm:block" />
      <Skeleton className="hidden h-3 w-16 md:block" />
      <Skeleton className="h-7 w-20 rounded-full" />
    </div>
  );
}
