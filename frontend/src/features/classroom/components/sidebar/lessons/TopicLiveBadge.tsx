'use client';

import { memo } from 'react';
import type { TopicLiveBadgeProps } from '../../../types/sidebar.types';

export const TopicLiveBadge = memo(function TopicLiveBadge({
  className = '',
}: TopicLiveBadgeProps) {
  return (
    <span
      className={`text-[10px] font-bold uppercase tracking-wider text-[#6ffbbe] bg-[#6ffbbe]/10 border border-[#6ffbbe]/20 px-2 py-0.5 rounded-full shrink-0 ${className}`}
    >
      Live
    </span>
  );
});

TopicLiveBadge.displayName = 'TopicLiveBadge';
