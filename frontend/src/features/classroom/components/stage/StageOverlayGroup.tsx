'use client';

import { memo } from 'react';
import { useStageOverlay } from '../../hooks/useStageOverlay';

export const StageOverlayGroup = memo(function StageOverlayGroup() {
  const { loading, error, loadingStatus } = useStageOverlay();

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-20">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
              <span className="absolute inset-0 flex items-center justify-center text-2xl">
                🧠
              </span>
            </div>
            <p className="text-slate-300 text-sm max-w-xs text-center">
              {loadingStatus || 'Preparing your lesson…'}
            </p>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm text-center max-w-sm">
          {error}
        </div>
      )}
    </>
  );
});

StageOverlayGroup.displayName = 'StageOverlayGroup';
