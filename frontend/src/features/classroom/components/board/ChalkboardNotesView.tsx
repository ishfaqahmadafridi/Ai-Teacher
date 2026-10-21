'use client';

import { memo } from 'react';
import type { ChalkboardNotesViewProps } from '../../types/board.types';

const MAX_VISIBLE_POINTS = 13;

export const ChalkboardNotesView = memo(function ChalkboardNotesView({
  points,
  isWriting,
  className = '',
}: ChalkboardNotesViewProps) {
  // Rolling list: Maintain maximum 13 visible points, discarding oldest from top
  const visiblePoints = points.slice(-MAX_VISIBLE_POINTS);

  return (
    <div
      className={`relative z-10 flex-1 w-full p-2 flex flex-col justify-start items-start gap-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${className}`}
    >
      {visiblePoints.map((pt, i) => {
        const isLatest = i === visiblePoints.length - 1;
        // Clean text: strip any leading bullet character so we don't render double bullets
        const cleanText = pt.replace(/^[\s•\-\*]+/, '').trim();

        return (
          <div
            key={`${i}-${cleanText.slice(0, 16)}`}
            className={`flex items-start gap-3 transition-all duration-300 ease-out animate-in fade-in slide-in-from-bottom-2 ${
              isLatest
                ? 'opacity-100'
                : 'opacity-85'
            }`}
          >
            <span
              className={`text-base sm:text-lg font-bold shrink-0 mt-[-2px] ${
                isLatest ? 'text-dashboard-primary' : 'text-classroom-board-muted'
              }`}
            >
              •
            </span>
            <p
              className={`font-sans text-sm md:text-base leading-7 ${
                isLatest
                  ? 'text-classroom-board-text font-semibold'
                  : 'text-classroom-board-muted'
              }`}
            >
              {cleanText}
            </p>
          </div>
        );
      })}


      {isWriting && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2.5 h-4 bg-dashboard-primary animate-pulse rounded-sm motion-reduce:animate-none" />
          <span className="text-xs text-classroom-board-muted">
            AI Tutor is teaching...
          </span>
        </div>
      )}
    </div>
  );
});



ChalkboardNotesView.displayName = 'ChalkboardNotesView';
