'use client';
import dynamic from 'next/dynamic';
import type { DiagramCommand, DiagramType } from '@/types';
import { FormulaOverlay } from './FormulaOverlay';

// Lazy-load the heavy Canvas — never bundle it in the initial JS
const DiagramCanvas = dynamic(() => import('./DiagramCanvas'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  ),
});

interface DiagramStageProps {
  diagramType: DiagramType;
  command: DiagramCommand | null;
  formula: string | null;
}

export function DiagramStage({ diagramType, command, formula }: DiagramStageProps) {
  return (
    <div className="relative w-full h-full">
      <DiagramCanvas diagramType={diagramType} command={command} />
      <FormulaOverlay command={command} formula={formula} />
    </div>
  );
}
