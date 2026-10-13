'use client';

import { memo } from 'react';
import Image from 'next/image';
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
      {command?.target?.startsWith('/classroom-assets/') ? <figure className="flex h-full flex-col gap-2 overflow-auto"><div className="relative min-h-64 flex-1"><Image data-lecture-image src={command.target} alt={command.annotation?.split('\n')[0] || 'Labelled educational anatomy diagram'} fill unoptimized className="object-contain" /></div><figcaption className="whitespace-pre-line text-xs text-slate-300">{command.annotation}</figcaption></figure> : diagramType === 'circuit' ? <CircuitLesson key={`${command?.parameters?.voltage ?? "example"}:${command?.parameters?.resistance ?? "example"}`} parameters={command?.parameters} /> : <DiagramCanvas diagramType={diagramType} command={command} />}
      <FormulaOverlay command={command} formula={formula} />
    </div>
  );
});

DiagramStage.displayName = 'DiagramStage';
