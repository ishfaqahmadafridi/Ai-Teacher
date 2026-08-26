'use client';

import { memo } from 'react';
import { useChalkboardStage } from '../../hooks/useChalkboardStage';
import { ChalkboardWelcomeSlate } from './ChalkboardWelcomeSlate';
import { ChalkboardNotesView } from './ChalkboardNotesView';

export const ChalkboardStage = memo(function ChalkboardStage() {
  const { points, isWriting, showGrid } = useChalkboardStage();

  return (
    <div className="relative w-full h-full flex flex-col font-sans select-none">
      {/* Clean Modern Blackboard Container */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#111A16] via-[#0D1412] to-[#080D0B] border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col">
        {/* Chalk dust ambient texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-400 to-transparent pointer-events-none z-0" />

        {/* Faint Blackboard Grid Lines Overlay */}
        {showGrid && (
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
        )}

        {/* Board Main Content Area */}
        {points.length === 0 ? (
          <ChalkboardWelcomeSlate />
        ) : (
          <ChalkboardNotesView points={points} isWriting={isWriting} />
        )}
      </div>
    </div>
  );
});

ChalkboardStage.displayName = 'ChalkboardStage';
