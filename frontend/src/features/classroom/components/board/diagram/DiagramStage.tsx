'use client';

import { memo } from 'react';
import { VISUAL_FAILURE_MESSAGES } from '../../../constants/visualFailureConstants';
import { VisualImage } from './VisualImage';
import { StructuredVisual } from './StructuredVisual';
import dynamic from 'next/dynamic';
import { CircuitLesson } from './CircuitLesson';
import { FormulaOverlay } from './FormulaOverlay';
import type { DiagramStageProps } from '../../../types/board.types';

// Lazy-load the heavy Canvas — never bundle it in the initial JS
const DiagramCanvas = dynamic(() => import('./DiagramCanvas').then(mod => mod.DiagramCanvas), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center w-full h-full">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  ),
});

export const DiagramStage = memo(function DiagramStage({ diagramType, command, formula }: DiagramStageProps) {
  return (
    <div className="relative w-full h-full">
      {command?.parameters ? <CircuitLesson key={`${command.parameters.voltage}:${command.parameters.resistance}`} parameters={command.parameters} /> : command?.visual ? <StructuredVisual visual={command.visual} /> : command?.visual_status === 'unavailable' ? <p role="status" className="text-sm text-slate-400">{VISUAL_FAILURE_MESSAGES[command.visual_reason ?? ''] ?? 'A visual is unavailable for this concept.'}</p> : (command?.target?.startsWith('/api/visual-assets/') || command?.target?.startsWith('/classroom-assets/') || command?.target?.startsWith('https://upload.wikimedia.org/') || command?.target?.startsWith('https://api.openverse.org/v1/images/')) ? <VisualImage key={command!.target!} src={command!.target!} annotation={command.annotation} /> : diagramType === 'circuit' ? <CircuitLesson key={`${command?.parameters?.voltage ?? "example"}:${command?.parameters?.resistance ?? "example"}`} parameters={command?.parameters} /> : <DiagramCanvas diagramType={diagramType} command={command} />}
      <FormulaOverlay command={command} formula={formula} />
    </div>
  );
});

DiagramStage.displayName = 'DiagramStage';
