'use client';

import { memo } from 'react';
import { CategoryTrack } from './CategoryTrack';
import { TRACK_1, TRACK_2, TRACK_3 } from '../../constants/categories';

export const CategoryScrollingTracks = memo(function CategoryScrollingTracks() {
  return (
    <div className="relative w-full z-10 py-10 overflow-hidden pointer-events-auto">
      <div className="text-center mb-6">
        <h3 className="text-sm font-semibold tracking-widest text-cyan-400/80 uppercase">
          Explore All Disciplines & Fields
        </h3>
      </div>
      <div className="flex flex-col gap-3 max-w-7xl mx-auto w-full">
        <CategoryTrack items={TRACK_1} className="intro-category-track-1" />
        <CategoryTrack items={TRACK_2} className="intro-category-track-2" />
        <CategoryTrack items={TRACK_3} className="intro-category-track-3" />
      </div>
    </div>
  );
});

CategoryScrollingTracks.displayName = 'CategoryScrollingTracks';
