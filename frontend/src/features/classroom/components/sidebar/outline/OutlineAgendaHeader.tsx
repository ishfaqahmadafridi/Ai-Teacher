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
      <span className="text-[11px] font-medium text-dashboard-muted tracking-wide flex items-center gap-2 font-['Hanken_Grotesk',sans-serif]">
        <Layers className="w-4 h-4 text-dashboard-primary" />
        Today&apos;s Topic Agenda
      </span>
      <span className="text-[10px] font-medium text-dashboard-muted bg-dashboard-subtle px-2.5 py-0.5 rounded-full border border-dashboard-border">
        {topicCount} Topics
      </span>
    </div>
  );
});

OutlineAgendaHeader.displayName = 'OutlineAgendaHeader';
