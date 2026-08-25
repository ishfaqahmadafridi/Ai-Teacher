'use client';

import { memo } from 'react';
import { Layers } from 'lucide-react';
import type { OutlineAgendaHeaderProps } from '../../../types/sidebar.types';

export const OutlineAgendaHeader = memo(function OutlineAgendaHeader({
  topicCount,
  className = '',
}: OutlineAgendaHeaderProps) {
  return (
    <div className={`flex items-center justify-between px-1 ${className}`}>
      <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2 font-['Hanken_Grotesk',sans-serif]">
        <Layers className="w-4 h-4 text-violet-400" />
        Today's Topic Agenda
      </span>
      <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30">
        {topicCount} Topics
      </span>
    </div>
  );
});

OutlineAgendaHeader.displayName = 'OutlineAgendaHeader';
