'use client';

import { CategoryTrack } from './CategoryTrack';
import { TRACK_1, TRACK_2, TRACK_3 } from '../../constants/categories';

export function CategoryScrollingTracks() {
  return (
    <div className="relative w-full z-10 py-6 overflow-hidden pointer-events-none">
      <div className="flex flex-col gap-2.5 max-w-7xl mx-auto w-full">
        <CategoryTrack items={TRACK_1} className="intro-category-track-1" />
        <CategoryTrack items={TRACK_2} className="intro-category-track-2" />
        <CategoryTrack items={TRACK_3} className="intro-category-track-3" />
      </div>
    </div>
  );
}
