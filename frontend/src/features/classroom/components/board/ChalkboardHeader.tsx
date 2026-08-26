'use client';

import { memo } from 'react';
import { Sparkles, Grid } from 'lucide-react';
import type { ChalkboardHeaderProps } from '../../types/board.types';

export const ChalkboardHeader = memo(function ChalkboardHeader({
  topic,
  isWriting,
  showGrid,
  onToggleGrid,
  className = '',
}: ChalkboardHeaderProps) {
  return (
    <div
      className={`px-6 py-3 border-b border-white/10 bg-[#0E1A16]/80 backdrop-blur-md flex items-center justify-between z-10 shrink-0 ${className}`}
    >
      {/* Left: Mode Badge */}
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-sm shadow-emerald-400/50" />
        <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-300/90 uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          Prof. Gemini Physics Board
        </span>
      </div>

      {/* Center: Topic Title */}
      {topic && (
        <div className="hidden sm:flex items-center gap-2 max-w-md truncate">
          <span className="text-xs font-mono font-bold text-yellow-200/90 tracking-wide truncate underline underline-offset-4 decoration-yellow-200/30">
            {topic}
          </span>
          {isWriting && (
            <span className="text-[10px] font-mono text-emerald-400 animate-pulse bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Writing...
            </span>
          )}
        </div>
      )}

      {/* Right: Grid Toggle Action */}
      <div className="flex items-center gap-2">
        {onToggleGrid && (
          <button
            type="button"
            onClick={onToggleGrid}
            className={`p-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer flex items-center gap-1.5 border ${
              showGrid
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10'
            }`}
            title="Toggle Blackboard Grid Lines"
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[10px]">Grid</span>
          </button>
        )}
      </div>
    </div>
  );
});

ChalkboardHeader.displayName = 'ChalkboardHeader';
