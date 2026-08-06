'use client';

import { memo } from 'react';
import type { FilterPillButtonProps } from '../../types/sidebar.types';

export const FilterPillButton = memo(function FilterPillButton({
  id,
  label,
  count,
  isActive,
  activeColor,
  onClick,
  className = '',
}: FilterPillButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(id)}
      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
        isActive
          ? `${activeColor} text-white`
          : 'bg-white/5 text-[#c4c5d9] hover:bg-white/10'
      } ${className}`}
    >
      {label} ({count})
    </button>
  );
});

FilterPillButton.displayName = 'FilterPillButton';
