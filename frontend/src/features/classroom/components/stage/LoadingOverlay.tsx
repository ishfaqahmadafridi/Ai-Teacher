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
      className={`absolute inset-0 flex items-center justify-center bg-[#0A0C10]/80 backdrop-blur-md z-30 ${className}`}
    >
      <div role="status" aria-live="polite" className="flex w-full max-w-[28rem] flex-col items-center gap-5 px-6 text-center">
        <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/30 bg-blue-500/10">
          <BookOpen aria-hidden="true" className="h-7 w-7 text-blue-300" />
          <LoaderCircle aria-hidden="true" className="absolute -right-2 -bottom-2 h-6 w-6 animate-spin rounded-full bg-slate-950 text-blue-300 motion-reduce:animate-none" />
        </div>
        <div className="w-full space-y-2">
          <p className="text-base font-semibold leading-6 text-slate-100">
            {loadingStatus || 'Preparing your live lesson…'}
          </p>
          <p className="text-sm leading-6 text-slate-400">Your lesson will appear here when it’s ready.</p>
        </div>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
