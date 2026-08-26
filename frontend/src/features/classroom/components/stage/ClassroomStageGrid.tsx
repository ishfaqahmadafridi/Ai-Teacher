'use client';

import { memo } from 'react';
import { useStageDiagramGrid } from '../../hooks/useStageDiagramGrid';
import { ChalkboardStage } from '../board/ChalkboardStage';
import { DynamicDiagramStage } from '../../utilities/lazyComponents';

export const ClassroomStageGrid = memo(function ClassroomStageGrid() {
  const { diagramType, currentCommand, currentFormula } = useStageDiagramGrid();

  return (
    <div className="absolute top-6 left-6 right-6 bottom-6 flex gap-6">
      <div className={`h-full transition-all duration-500 ${diagramType !== 'default' ? 'w-[45%]' : 'w-full'}`}>
        <ChalkboardStage />
      </div>
      {diagramType !== 'default' && (
        <div className="w-[55%] h-full rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm overflow-hidden relative shadow-lg">
          <DynamicDiagramStage
            diagramType={diagramType}
            command={currentCommand}
            formula={currentFormula}
          />
        </div>
      )}
    </div>
  );
});

ClassroomStageGrid.displayName = 'ClassroomStageGrid';
