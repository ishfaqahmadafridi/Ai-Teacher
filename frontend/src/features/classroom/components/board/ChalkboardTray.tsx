'use client';

import { memo } from 'react';
import type { ChalkboardTrayProps } from '../../types/board.types';

export const ChalkboardTray = memo(function ChalkboardTray({
  className = '',
}: ChalkboardTrayProps) {
  return (
    <div
      className={`h-5 bg-gradient-to-r from-[#2B160A] via-[#4A2613] to-[#2B160A] border-t border-[#62341A] shadow-md flex items-center justify-between px-6 z-20 shrink-0 ${className}`}
    >
      {/* Left Tray Items: White, Yellow, Blue, Pink Chalk Sticks */}
      <div className="flex items-center gap-2">
        <div
          className="w-8 h-2 bg-gradient-to-r from-white to-slate-200 rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity"
          title="White Chalk"
        />
        <div
          className="w-7 h-2 bg-gradient-to-r from-yellow-200 to-amber-300 rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity"
          title="Yellow Chalk"
        />
        <div
          className="w-6 h-2 bg-gradient-to-r from-cyan-300 to-blue-400 rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity"
          title="Cyan Chalk"
        />
        <div
          className="w-7 h-2 bg-gradient-to-r from-pink-300 to-rose-400 rounded-sm shadow-sm opacity-90 hover:opacity-100 transition-opacity"
          title="Pink Chalk"
        />
      </div>

      {/* Right Tray Item: Felt Blackboard Eraser */}
      <div className="flex items-center gap-2">
        <div
          className="w-12 h-3 bg-gradient-to-r from-[#5C3B24] to-[#3D2616] rounded border border-[#2B190E] shadow-inner relative flex items-center justify-center"
          title="Felt Chalk Eraser"
        >
          <div className="w-10 h-1 bg-amber-900/60 rounded-full" />
        </div>
      </div>
    </div>
  );
});

ChalkboardTray.displayName = 'ChalkboardTray';
