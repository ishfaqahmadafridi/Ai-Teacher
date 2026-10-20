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
      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-dashboard-panel border border-dashboard-border whitespace-nowrap select-none transition-colors hover:border-dashboard-primary/40 focus-visible:outline-2 focus-visible:outline-dashboard-primary"
      style={{
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <span className="text-base leading-none">{item.icon}</span>
      <span className="font-sans text-[13px] font-medium text-dashboard-muted tracking-normal">
        {item.label}
      </span>
    </button>
  );
});

CategoryPill.displayName = 'CategoryPill';
