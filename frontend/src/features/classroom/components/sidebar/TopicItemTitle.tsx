'use client';

import { memo } from 'react';
import type { TopicItemTitleProps } from '../../types/sidebar.types';

export const TopicItemTitle = memo(function TopicItemTitle({
  title,
  isLive = false,
  isActive = false,
  className = '',
}: TopicItemTitleProps) {
  const isHighlight = isLive || isActive;

  return (
    <span
      className={`font-['Hanken_Grotesk',sans-serif] text-xs font-medium ${
        isHighlight ? 'text-[#6ffbbe]' : 'text-[#e2e2e8] group-hover:text-[#b8c3ff]'
      } transition-colors flex-1 truncate ${className}`}
    >
      {title}
    </span>
  );
});

TopicItemTitle.displayName = 'TopicItemTitle';
