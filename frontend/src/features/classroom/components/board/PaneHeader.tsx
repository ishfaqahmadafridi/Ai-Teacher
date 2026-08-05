'use client';

import { memo } from 'react';
import { ListOrdered } from 'lucide-react';

export interface PaneHeaderProps {
  title: string;
  iconColor?: string;
  className?: string;
}

export const PaneHeader = memo(function PaneHeader({
  title,
  iconColor = 'text-[#ffb59b]',
  className = '',
}: PaneHeaderProps) {
  return (
    <div className={`flex items-center justify-between mb-6 shrink-0 ${className}`}>
      <h3 className="font-['Hanken_Grotesk',sans-serif] text-base md:text-lg font-semibold text-[#e2e2e8] flex items-center gap-2">
        <ListOrdered className={`w-5 h-5 ${iconColor}`} aria-hidden="true" />
        {title}
      </h3>
    </div>
  );
});

PaneHeader.displayName = 'PaneHeader';
