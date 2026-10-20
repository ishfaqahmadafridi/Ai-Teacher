'use client';

import { memo } from 'react';
import { LoadingOverlay } from './LoadingOverlay';
import { useStageOverlay } from '../../hooks/useStageOverlay';

export const StageOverlayGroup = memo(function StageOverlayGroup() {
  const { loading, error, loadingStatus } = useStageOverlay();

  return (
    <>
      {/* Loading overlay */}
      <LoadingOverlay isLoading={loading} loadingStatus={loadingStatus} />

      {/* Error Banner */}
      {error && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm text-center w-[calc(100%-2rem)] max-w-[32rem]">
          {error}
        </div>
      )}
    </>
  );
});

StageOverlayGroup.displayName = 'StageOverlayGroup';
