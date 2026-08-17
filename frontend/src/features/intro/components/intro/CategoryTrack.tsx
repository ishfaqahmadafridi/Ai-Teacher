'use client';

import { memo } from 'react';
import { CategoryPill } from './CategoryPill';
import type { CategoryTrackProps } from '../../types/intro.types';

export const CategoryTrack = memo(function CategoryTrack({
  items,
  className = '',
}: CategoryTrackProps) {
  // Quadruple items array to guarantee seamless loop scrolling wrapping effect
  const quadrupledItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className="overflow-hidden py-1"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)',
      }}
    >
      <div className={`flex gap-3.5 w-max ${className}`}>
        {quadrupledItems.map((item, index) => (
          <CategoryPill
            key={`${item.id}-${index}`}
            item={item}
          />
        ))}
      </div>
    </div>
  );
});

CategoryTrack.displayName = 'CategoryTrack';
