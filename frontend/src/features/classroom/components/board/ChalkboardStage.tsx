'use client';

import { memo } from 'react';
import '../../styles/board.css';
import { useChalkboardStage } from '../../hooks/useChalkboardStage';
import { ChalkboardWelcomeSlate } from './ChalkboardWelcomeSlate';
import { ChalkboardNotesView } from './ChalkboardNotesView';

export const ChalkboardStage = memo(function ChalkboardStage() {
  const { points, isWriting, showGrid } = useChalkboardStage();

  return (
    <div className="relative w-full h-full flex flex-col font-sans select-none">
      {/* Clean Modern Blackboard Container */}
      <div className="classroom-board absolute inset-0 overflow-y-auto flex flex-col px-6 sm:px-8">
        {/* Faint Blackboard Grid Lines Overlay */}
        {showGrid && (
          <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(rgba(36,89,196,0.3)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
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
