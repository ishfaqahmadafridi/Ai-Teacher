'use client';

import { memo } from 'react';
import { PanelsTopLeft, Maximize2, Minimize2 } from 'lucide-react';
import '../../styles/board.css';
import { useStageDiagramGrid } from '../../hooks/useStageDiagramGrid';
import { useBoardFullscreen } from '../../hooks/useBoardFullscreen';
import { useChalkboardStage } from '../../hooks/useChalkboardStage';
import { ChalkboardWelcomeSlate } from '../board/ChalkboardWelcomeSlate';
import { ChalkboardNotesView } from '../board/ChalkboardNotesView';
import { DynamicDiagramStage } from '../lazyComponents';

export const ClassroomStageGrid = memo(function ClassroomStageGrid() {
  const { diagramType, currentCommand, currentFormula, hasVisual } = useStageDiagramGrid();
  const { points, isWriting, showGrid, topic } = useChalkboardStage();

  const { boardRef, isFullscreen, expanded, toggleFullscreen } = useBoardFullscreen();

  const hasContent = points.length > 0;

  return (
    <div className="absolute inset-3 sm:inset-5 flex flex-col font-sans select-none">
      {/* Single Clean Unified Classroom Container — Zero internal divider lines */}
      <div ref={boardRef} data-fullscreen-board={isFullscreen} className={`classroom-board relative w-full h-full min-h-0 overflow-y-auto flex flex-col px-5 pb-5 sm:px-8 sm:pb-8 ${expanded ? 'classroom-board-expanded' : ''}`}>
        <header className="relative z-10 flex shrink-0 items-center justify-between gap-4 border-b border-classroom-board-border py-4 sm:py-5">
          <div className="flex min-w-0 items-center gap-2.5"><PanelsTopLeft className="h-4 w-4 shrink-0 text-classroom-board-muted" aria-hidden="true" /><h1 className="truncate text-sm font-medium text-classroom-board-text" title={topic || 'Lesson board'}>{topic || 'Lesson board'}</h1></div>
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs text-classroom-board-muted sm:inline">{hasContent || hasVisual ? 'Notes & visuals' : 'Ready when you are'}</span>
            <button type="button" onClick={toggleFullscreen} aria-pressed={isFullscreen}
              aria-label={isFullscreen ? 'Exit fullscreen board' : 'Open board fullscreen'}
              title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Open board fullscreen'}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-classroom-board-border text-classroom-board-muted transition-colors hover:bg-dashboard-selected hover:text-dashboard-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashboard-primary">
              {isFullscreen ? <Minimize2 className="h-4 w-4" aria-hidden="true" /> : <Maximize2 className="h-4 w-4" aria-hidden="true" />}
            </button>
          </div>
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
        <div data-fullscreen-input-host className="classroom-fullscreen-input-host">
          <button type="button" className="classroom-fullscreen-input-handle" aria-label="Show question input">
            <span aria-hidden="true" className="h-1 w-10 rounded-full bg-dashboard-muted/40" />
          </button>
        </div>
      </div>
    </div>
  );
});

ClassroomStageGrid.displayName = 'ClassroomStageGrid';

