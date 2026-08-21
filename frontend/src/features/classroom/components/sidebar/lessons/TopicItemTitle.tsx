'use client';

import { memo } from 'react';
import type { TopicItemTitleProps } from '../../../types/sidebar.types';

export const TopicItemTitle = memo(function TopicItemTitle({
  title,
  isLive = false,
  isActive = false,
  className = '',
}: TopicItemTitleProps) {
  const isHighlight = isLive || isActive;

  return (
    <span
      className={`font-['Hanken_Grotesk',sans-serif] text-xs transition-colors flex-1 truncate text-left ${
        isHighlight
          ? 'font-bold text-[#b8c3ff] group-hover:text-white'
          : 'font-normal text-[#c4c5d9] group-hover:text-[#e2e2e8]'
      } ${className}`}
    >
      {title}
    </span>
  );
});

TopicItemTitle.displayName = 'TopicItemTitle';
