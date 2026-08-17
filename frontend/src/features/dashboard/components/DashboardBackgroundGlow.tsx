'use client';

import { memo } from 'react';
import type { DashboardBackgroundGlowProps } from '../types/dashboard.types';

export const DashboardBackgroundGlow = memo(function DashboardBackgroundGlow({
  className = '',
}: DashboardBackgroundGlowProps) {
  return (
    <div className={className}>
      <div
        className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-[#2563eb]/10 rounded-full blur-[120px] pointer-events-none z-0"
        aria-hidden="true"
      />
      <div
        className="fixed bottom-0 right-10 w-[400px] h-[400px] bg-[#712ae2]/10 rounded-full blur-[100px] pointer-events-none z-0"
        aria-hidden="true"
      />
    </div>
  );
});

DashboardBackgroundGlow.displayName = 'DashboardBackgroundGlow';
