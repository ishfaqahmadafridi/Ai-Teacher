'use client';

import { memo } from 'react';
import type { TopicStatusDotProps } from '../../types/sidebar.types';

export const TopicStatusDot = memo(function TopicStatusDot({
  isLive = false,
  className = '',
}: TopicStatusDotProps) {
  return (
    <div
      className={`w-2 h-2 rounded-full shrink-0 ${
        isLive
          ? 'bg-[#6ffbbe] shadow-[0_0_8px_rgba(111,251,190,0.8)]'
          : 'bg-[#b8c3ff] group-hover:shadow-[0_0_8px_rgba(184,195,255,0.8)]'
      } ${className}`}
      aria-hidden="true"
    />
  );
});

TopicStatusDot.displayName = 'TopicStatusDot';
