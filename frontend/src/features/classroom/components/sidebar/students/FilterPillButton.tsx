'use client';

import { memo } from 'react';
import type { FilterPillButtonProps } from '../../../types/sidebar.types';

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
      className={`px-3 py-1.5 rounded-lg font-['Hanken_Grotesk',sans-serif] text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
        isActive
          ? `${activeColor} text-black font-bold`
          : 'bg-white/5 hover:bg-white/10 text-[#c4c5d9]'
      } ${className}`}
    >
      <span>{label}</span>
      <span className="opacity-70">({count})</span>
    </button>
  );
});

FilterPillButton.displayName = 'FilterPillButton';
