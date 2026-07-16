'use client';

interface LoadingSkeletonProps {
  lines?: number;
  className?: string;
}

export function LoadingSkeleton({ lines = 4, className = '' }: LoadingSkeletonProps) {
  return (
    <div className={`flex flex-col gap-3 p-4 ${className}`} aria-busy="true" aria-label="Loading…">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-lg bg-slate-800 animate-pulse"
          style={{ width: `${85 - i * 10}%`, opacity: 1 - i * 0.15 }}
        />
      ))}
    </div>
  );
}

export function ChalkboardSkeleton() {
  return (
    <div className="absolute inset-0 rounded-2xl bg-slate-800/60 border-4 border-amber-900/40 overflow-hidden flex flex-col gap-4 p-6">
      <div className="h-5 w-48 mx-auto rounded-lg bg-slate-700/80 animate-pulse" />
      {[70, 90, 55, 75].map((w, i) => (
        <div
          key={i}
          className="h-4 rounded bg-slate-700/60 animate-pulse"
          style={{ width: `${w}%`, animationDelay: `${i * 120}ms` }}
        />
      ))}
    </div>
  );
}
