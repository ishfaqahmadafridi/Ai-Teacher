'use client';

import { memo } from 'react';
import { HelpCircle } from 'lucide-react';
import type { DoubtHeaderProps } from '../../../types/sidebar.types';

export const DoubtHeader = memo(function DoubtHeader({
  title = 'Live Doubt Assistant',
  badge = 'Interactive',
  className = '',
}: DoubtHeaderProps) {
  return (
    <div className={`flex items-center justify-between px-1 ${className}`}>
      <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 font-['Hanken_Grotesk',sans-serif]">
        <HelpCircle className="w-4 h-4 text-cyan-400" />
        {title}
      </span>
      <span className="text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/15 px-2 py-0.5 rounded-full border border-cyan-500/30">
        {badge}
      </span>
    </div>
  );
});

DoubtHeader.displayName = 'DoubtHeader';
