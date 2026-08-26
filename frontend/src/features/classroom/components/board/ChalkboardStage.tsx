'use client';

import { memo } from 'react';
import { useChalkboardStage } from '../../hooks/useChalkboardStage';
import { ChalkboardHeader } from './ChalkboardHeader';
import { ChalkboardTray } from './ChalkboardTray';
import { ChalkboardWelcomeSlate } from './ChalkboardWelcomeSlate';
import { ChalkboardNotesView } from './ChalkboardNotesView';

export const ChalkboardStage = memo(function ChalkboardStage() {
  const {
    points,
    isWriting,
    topic,
    showGrid,
    toggleGrid,
    handleSelectSamplePrompt,
  } = useChalkboardStage();

  return (
    <div className="relative w-full h-full flex flex-col font-sans select-none">
      {/* Executive Wooden Beveled Blackboard Frame */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#13201B] via-[#0E1714] to-[#0A100E] border-[8px] sm:border-[10px] border-[#3B1F0E] ring-1 ring-[#1A0B05] shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.1)] overflow-hidden flex flex-col">
        {/* Brass Corner Metal Brackets Accent (Top-Left, Top-Right, Bottom-Left, Bottom-Right) */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600/60 z-20" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-600/60 z-20" />
        <div className="absolute bottom-5 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-600/60 z-20" />
        <div className="absolute bottom-5 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600/60 z-20" />

        {/* Chalk dust ambient texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-400 to-transparent pointer-events-none z-0" />

        {/* Faint Blackboard Grid Lines Overlay */}
        {showGrid && (
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
        )}

        {/* Smart Board Header */}
        <ChalkboardHeader
          topic={topic}
          isWriting={isWriting}
          showGrid={showGrid}
          onToggleGrid={toggleGrid}
        />

        {/* Board Main Content Area */}
        {points.length === 0 ? (
          <ChalkboardWelcomeSlate onSelectSamplePrompt={handleSelectSamplePrompt} />
        ) : (
          <ChalkboardNotesView points={points} isWriting={isWriting} />
        )}

        {/* Wooden Chalk Tray at the bottom */}
        <ChalkboardTray />
      </div>
    </div>
  );
});

ChalkboardStage.displayName = 'ChalkboardStage';
