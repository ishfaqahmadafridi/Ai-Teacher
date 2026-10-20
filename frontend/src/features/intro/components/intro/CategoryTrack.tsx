'use client';

import { memo } from 'react';
import { CategoryPill } from './CategoryPill';
import type { CategoryTrackProps } from '../../types/intro.types';

export const CategoryTrack = memo(function CategoryTrack({
  items,
  className = '',
}: CategoryTrackProps) {
  return (
    <div className="intro-category-window py-1">
      <div className={`intro-category-motion ${className}`}>
        <div className="intro-category-group">
          {items.map((item) => <CategoryPill key={item.id} item={item} />)}
        </div>
        <div className="intro-category-group intro-category-copy" aria-hidden="true" inert>
          {items.map((item) => <CategoryPill key={item.id} item={item} />)}
        </div>
      </div>
    </div>
  );
});

CategoryTrack.displayName = 'CategoryTrack';
