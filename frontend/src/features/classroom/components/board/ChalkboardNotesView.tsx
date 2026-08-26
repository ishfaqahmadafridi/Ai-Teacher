'use client';

import { memo } from 'react';
import type { ChalkboardNotesViewProps } from '../../types/board.types';

export const ChalkboardNotesView = memo(function ChalkboardNotesView({
  points,
  isWriting,
  className = '',
}: ChalkboardNotesViewProps) {
  return (
    <div
      className={`relative z-10 flex-1 p-6 flex flex-col gap-4 overflow-y-auto ${className}`}
    >
      {points.map((pt, i) => (
        <div
          key={i}
          className={`flex items-start gap-3 transition-all duration-500 ${
            isWriting && i === points.length - 1
              ? 'opacity-100 translate-x-0'
              : 'opacity-90 translate-x-0'
          }`}
        >
          <span className="text-yellow-200/90 font-mono font-bold text-sm sm:text-base mt-0.5 shrink-0 drop-shadow-[0_0_6px_rgba(254,240,138,0.3)]">
            {i + 1}.
          </span>
          <p className="text-white/95 font-mono text-sm sm:text-base leading-relaxed tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
            {pt}
          </p>
        </div>
      ))}

      {isWriting && (
        <div className="flex items-center gap-2 mt-2">
          <div className="w-2.5 h-6 bg-emerald-400 animate-pulse rounded-sm shadow-md shadow-emerald-400/50" />
          <span className="text-xs font-mono text-emerald-300/80 italic animate-pulse">
            AI Tutor is writing on the board...
          </span>
        </div>
      )}
    </div>
  );
});

ChalkboardNotesView.displayName = 'ChalkboardNotesView';
