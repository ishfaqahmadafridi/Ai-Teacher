'use client';

import { memo } from 'react';
import { Activity } from 'lucide-react';
import type { SimulationHeaderProps } from '../../types/board.types';

export const SimulationHeader = memo(function SimulationHeader({
  title = 'Force Vectors',
  badgeText = 'Live Simulation',
  className = '',
}: SimulationHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 shrink-0 ${className}`}>
      <h3 className="font-['Hanken_Grotesk',sans-serif] text-base md:text-lg font-semibold text-[#e2e2e8] flex items-center gap-2">
        <Activity className="w-5 h-5 text-[#b8c3ff]" aria-hidden="true" />
        {title}
      </h3>
      <span className="px-3 py-1 bg-[#b8c3ff]/10 text-[#b8c3ff] rounded-full text-[10px] md:text-xs font-semibold tracking-wider uppercase border border-[#b8c3ff]/20 shrink-0">
        {badgeText}
      </span>
    </div>
  );
});

SimulationHeader.displayName = 'SimulationHeader';
