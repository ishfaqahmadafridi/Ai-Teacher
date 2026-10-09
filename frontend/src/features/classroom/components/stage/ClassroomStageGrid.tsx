'use client';

import { memo } from 'react';
import { useStageDiagramGrid } from '../../hooks/useStageDiagramGrid';
import { useChalkboardStage } from '../../hooks/useChalkboardStage';
import { ChalkboardWelcomeSlate } from '../board/ChalkboardWelcomeSlate';
import { ChalkboardNotesView } from '../board/ChalkboardNotesView';
import { DynamicDiagramStage } from '../../utilities/lazyComponents';

export const ClassroomStageGrid = memo(function ClassroomStageGrid() {
  const { diagramType, currentCommand, currentFormula } = useStageDiagramGrid();
  const { points, isWriting, showGrid } = useChalkboardStage();

  const hasContent = points.length > 0;
  const hasVisual = diagramType !== 'default';

  return (
    <div className="absolute top-6 left-6 right-6 bottom-6 flex flex-col font-sans select-none">
      {/* Single Clean Unified Classroom Container — Zero internal divider lines */}
      <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#111A16] via-[#0D1412] to-[#080D0B] border border-slate-800/80 shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8">
        {/* Ambient blackboard texture */}
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-400 to-transparent pointer-events-none z-0" />

        {/* Faint Grid Lines Overlay if enabled */}
        {showGrid && (
          <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(rgba(255,255,255,0.3)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
        )}

        {/* Dynamic Classroom Content inside the Single Unified Container */}
        {!hasContent && !hasVisual ? (
          <ChalkboardWelcomeSlate />
        ) : (
          <div className="relative z-10 flex-1 flex flex-col lg:flex-row items-start gap-8 overflow-hidden pt-2">
            {/* Left Side: Dynamic Short Teaching Points */}
            <div className={`h-full flex flex-col justify-start items-start transition-all duration-500 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${hasVisual ? 'w-full lg:w-1/2' : 'w-full lg:w-3/5'}`}>
              <ChalkboardNotesView points={points} isWriting={isWriting} />
            </div>



            {/* Right Side: Dynamic Visual Teaching Content */}
            {hasVisual && (
              <div className="w-full lg:w-1/2 h-full flex items-center justify-center overflow-hidden transition-all duration-500">
                <DynamicDiagramStage
                  diagramType={diagramType}
                  command={currentCommand}
                  formula={currentFormula}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
});

ClassroomStageGrid.displayName = 'ClassroomStageGrid';

