'use client';

import { memo } from 'react';
import type { CategoryPillProps } from '../../types/intro.types';

export const CategoryPill = memo(function CategoryPill({
  item,
  onClick,
}: CategoryPillProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(item)}
      className="intro-category-pill inline-flex items-center gap-2.5 px-[20px] py-[10px] rounded-full bg-white/[0.04] border border-white/10 backdrop-blur-md whitespace-nowrap cursor-pointer select-none transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-500/10 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)] active:scale-95"
      style={{
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span className="text-base leading-none">{item.icon}</span>
      <span className="font-sans text-[13px] font-medium text-blue-100/85 tracking-wide">
        {item.label}
      </span>
    </button>
  );
});

CategoryPill.displayName = 'CategoryPill';
