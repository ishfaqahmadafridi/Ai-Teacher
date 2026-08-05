'use client';

import { memo } from 'react';
import { SimulationHeader } from './SimulationHeader';
import { SimulationCanvas } from './SimulationCanvas';
import type { SimulationPaneProps } from './board.types';

export const SimulationPane = memo(function SimulationPane({
  title = 'Force Vectors',
  badgeText = 'Live Simulation',
  className = '',
}: SimulationPaneProps) {
  return (
    <div
      className={`w-full lg:w-1/2 h-full border-b lg:border-b-0 lg:border-r border-white/10 p-6 md:p-8 relative flex flex-col ${className}`}
    >
      {/* Simulation Header Sub-component */}
      <SimulationHeader title={title} badgeText={badgeText} />

      {/* Simulation Canvas Visual Graphic Sub-component */}
      <SimulationCanvas />
    </div>
  );
});

SimulationPane.displayName = 'SimulationPane';
