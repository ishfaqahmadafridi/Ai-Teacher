'use client';

import { memo } from 'react';
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
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-14 h-14 border-4 border-[#2e5bff]/30 border-t-[#2e5bff] rounded-full animate-spin" />
          <span className="absolute inset-0 flex items-center justify-center text-2xl">
            🧠
          </span>
        </div>
        <p className="text-[#e2e2e8] text-sm max-w-xs text-center font-medium">
          {loadingStatus || 'Preparing your live lesson…'}
        </p>
      </div>
    </div>
  );
});

LoadingOverlay.displayName = 'LoadingOverlay';
