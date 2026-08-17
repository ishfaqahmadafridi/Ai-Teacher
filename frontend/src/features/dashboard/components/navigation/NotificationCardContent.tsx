'use client';

import { memo } from 'react';
import type { NotificationCardContentProps } from '../../types/topbar.types';

export const NotificationCardContent = memo(function NotificationCardContent({
  title,
  message,
  timeFormatted,
  className = '',
}: NotificationCardContentProps) {
  return (
    <div className={`flex-1 space-y-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-white leading-tight">{title}</span>
        <span className="text-[10px] text-[#64748B] font-mono whitespace-nowrap">
          {timeFormatted}
        </span>
      </div>
      <p className="text-xs text-[#94A3B8] leading-relaxed">{message}</p>
    </div>
  );
});

NotificationCardContent.displayName = 'NotificationCardContent';
