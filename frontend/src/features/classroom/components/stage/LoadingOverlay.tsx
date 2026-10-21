'use client';

import { memo } from 'react';
import { BookOpen, LoaderCircle } from 'lucide-react';
import type { LoadingOverlayProps } from './stage.types';

export const LoadingOverlay = memo(function LoadingOverlay({
  isLoading,
  loadingStatus,
  className = '',
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-dashboard-panel/90 backdrop-blur-md z-30 ${className}`}
    >
      <div role="status" aria-live="polite" className="flex w-full max-w-[28rem] flex-col items-center gap-5 px-6 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-dashboard-primary/20 bg-dashboard-selected">
          <BookOpen aria-hidden="true" className="h-7 w-7 text-dashboard-primary" />
          <LoaderCircle aria-hidden="true" className="absolute -right-2 -bottom-2 h-6 w-6 animate-spin rounded-full bg-dashboard-panel text-dashboard-primary motion-reduce:animate-none" />
        </div>
        <div className="w-full space-y-2">
          <p className="text-base font-semibold leading-6 text-dashboard-text">
            {loadingStatus || 'Preparing your live lesson…'}
          </p>
          <p className="text-sm leading-6 text-dashboard-muted">Your lesson will appear here when it’s ready.</p>
        </div>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
