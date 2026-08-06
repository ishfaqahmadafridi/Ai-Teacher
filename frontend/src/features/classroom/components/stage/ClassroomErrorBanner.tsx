'use client';

import { memo } from 'react';
import type { ClassroomErrorBannerProps } from './stage.types';

export const ClassroomErrorBanner = memo(function ClassroomErrorBanner({
  error,
  className = '',
}: ClassroomErrorBannerProps) {
  if (!error) return null;

  return (
    <div
      className={`absolute bottom-20 left-1/2 -translate-x-1/2 z-40 bg-[#93000a]/30 border border-[#ffb4ab]/40 rounded-xl px-5 py-2.5 text-[#ffb4ab] text-xs md:text-sm text-center max-w-md backdrop-blur-md shadow-lg ${className}`}
      role="alert"
    >
      {error}
    </div>
  );
});

ClassroomErrorBanner.displayName = 'ClassroomErrorBanner';
