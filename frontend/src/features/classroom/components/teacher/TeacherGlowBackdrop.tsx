'use client';

import { memo } from 'react';
import type { TeacherGlowBackdropProps } from './teacher.types';

export const TeacherGlowBackdrop = memo(function TeacherGlowBackdrop({
  isActive = true,
  className = '',
}: TeacherGlowBackdropProps) {
  if (!isActive) return null;

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none ${className}`}>
      {/* Outer Diffused Blur Glow */}
      <div
        className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-[#2e5bff]/25 blur-3xl transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Inner Active Energy Pulse Ring */}
      <div
        className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-[#2e5bff]/40 pulse-ring absolute opacity-50"
        aria-hidden="true"
      />
    </div>
  );
});

TeacherGlowBackdrop.displayName = 'TeacherGlowBackdrop';
