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
                isLatest ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]' : 'text-emerald-500/70'
              }`}
            >
              •
            </span>
            <p
              className={`font-mono text-xs sm:text-sm md:text-base leading-relaxed tracking-wide ${
                isLatest
                  ? 'text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]'
                  : 'text-slate-200'
              }`}
            >
              {cleanText}
            </p>
          </div>
        );
      })}


      {isWriting && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2.5 h-4 bg-emerald-400 animate-pulse rounded-sm shadow-md shadow-emerald-400/50" />
          <span className="text-xs font-mono text-emerald-300/80 italic animate-pulse">
            AI Tutor is teaching...
          </span>
        </div>
      )}
    </div>
  );
});



ChalkboardNotesView.displayName = 'ChalkboardNotesView';
