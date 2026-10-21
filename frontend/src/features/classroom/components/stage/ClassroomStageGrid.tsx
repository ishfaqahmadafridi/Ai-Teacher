'use client';

import { memo } from 'react';
import { PanelsTopLeft } from 'lucide-react';
import '../../styles/board.css';
import { useStageDiagramGrid } from '../../hooks/useStageDiagramGrid';
import { useChalkboardStage } from '../../hooks/useChalkboardStage';
import { ChalkboardWelcomeSlate } from '../board/ChalkboardWelcomeSlate';
import { ChalkboardNotesView } from '../board/ChalkboardNotesView';
import { DynamicDiagramStage } from '../../utilities/lazyComponents';

export const ClassroomStageGrid = memo(function ClassroomStageGrid() {
  const { diagramType, currentCommand, currentFormula, hasVisual } = useStageDiagramGrid();
  const { points, isWriting, showGrid, topic } = useChalkboardStage();

  const hasContent = points.length > 0;

  return (
    <div className="absolute inset-3 sm:inset-5 flex flex-col font-sans select-none">
      {/* Single Clean Unified Classroom Container — Zero internal divider lines */}
      <div className="classroom-board relative w-full h-full min-h-0 overflow-y-auto flex flex-col px-5 pb-5 sm:px-8 sm:pb-8">
        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-classroom-board-border py-4 sm:py-5">
          <div className="flex min-w-0 items-center gap-2.5"><PanelsTopLeft className="h-4 w-4 shrink-0 text-classroom-board-muted" aria-hidden="true" /><h1 className="truncate text-sm font-medium text-classroom-board-text" title={topic || 'Lesson board'}>{topic || 'Lesson board'}</h1></div>
          <span className="shrink-0 text-xs text-classroom-board-muted">{hasContent || hasVisual ? 'Notes & visuals' : 'Ready when you are'}</span>
        </header>

        {/* Faint Grid Lines Overlay if enabled */}
        {showGrid && (
          <div className="absolute inset-0 opacity-[0.025] bg-[radial-gradient(rgba(36,89,196,0.3)_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none z-0" />
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

