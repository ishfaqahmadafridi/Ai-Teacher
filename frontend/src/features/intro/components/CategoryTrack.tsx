'use client';

import { CategoryPill } from './CategoryPill';
import type { CategoryItem } from '../types/intro.types';

interface CategoryTrackProps {
  items: CategoryItem[];
  className: string;
}

export function CategoryTrack({ items, className }: CategoryTrackProps) {
  // Double items array to create seamless loop wrapping effect
  const doubledItems = [...items, ...items];

  return (
    <div
      className="overflow-hidden"
      style={{
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div className={`flex gap-3 w-max ${className}`}>
        {doubledItems.map((item, index) => (
          <CategoryPill
            key={`${item.label}-${index}`}
            icon={item.icon}
            label={item.label}
          />
        ))}
      </div>
    </div>
  );
}
