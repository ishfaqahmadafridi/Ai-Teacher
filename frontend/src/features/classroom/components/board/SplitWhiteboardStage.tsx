'use client';

import { memo } from 'react';
import { SimulationPane } from './SimulationPane';
import { PrinciplesNotesPane } from './PrinciplesNotesPane';
import type { SplitWhiteboardStageProps } from './board.types';

export const SplitWhiteboardStage = memo(function SplitWhiteboardStage({
  className = '',
}: SplitWhiteboardStageProps) {
  return (
    <div
      className={`w-full max-w-6xl h-full max-h-[720px] glass-floating rounded-3xl relative z-10 flex flex-col lg:flex-row overflow-hidden shadow-2xl ${className}`}
    >
      {/* Top Edge Inner Glow Line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent z-20"
        aria-hidden="true"
      />

      {/* Left Pane: Force Vector Simulations */}
      <SimulationPane />

      {/* Right Pane: Core Principles & Equation Notes */}
      <PrinciplesNotesPane />
    </div>
  );
});

SplitWhiteboardStage.displayName = 'SplitWhiteboardStage';
