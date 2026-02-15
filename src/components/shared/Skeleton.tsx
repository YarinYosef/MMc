import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-[var(--surface-2)] via-[var(--surface-3)] to-[var(--surface-2)]',
        'bg-[length:200%_100%] animate-[shimmer_1.5s_ease-in-out_infinite] rounded',
        className
      )}
      style={style}
    />
  );
}

export function SkeletonText({ className, lines = 3 }: SkeletonProps & { lines?: number }) {
  return (
    <div className={cn('space-y-1.5', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-2.5', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
}

export function SkeletonChart({ className, height = 120 }: SkeletonProps & { height?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Chart area */}
      <Skeleton className="w-full rounded" style={{ height }} />
      {/* X-axis labels */}
      <div className="flex justify-between px-2">
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-8" />
        <Skeleton className="h-2 w-8" />
      </div>
    </div>
  );
}

export function SkeletonMetric({ className }: SkeletonProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Skeleton className="h-2 w-12" />
      <Skeleton className="h-5 w-16" />
    </div>
  );
}

export function SkeletonMetricGrid({ className, count = 6 }: SkeletonProps & { count?: number }) {
  return (
    <div className={cn('grid grid-cols-3 gap-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMetric key={i} />
      ))}
    </div>
  );
}

export function SkeletonSection({ className }: SkeletonProps) {
  return (
    <div className={cn('p-3 space-y-3', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      {/* Metrics row */}
      <SkeletonMetricGrid count={3} />
      {/* Chart */}
      <SkeletonChart height={100} />
    </div>
  );
}

export function SkeletonTable({
  className,
  rows = 4,
  cols = 3,
}: SkeletonProps & { rows?: number; cols?: number }) {
  return (
    <div className={cn('space-y-2', className)}>
      {/* Header row */}
      <div className="flex gap-3">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 flex-1" />
        ))}
      </div>
      {/* Data rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-3">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
