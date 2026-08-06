'use client';

import { memo } from 'react';
import { useAppSelector } from '@/hooks/useAppStore';
import { SplitWhiteboardStage } from '../board';
import { DiagramStage } from '../board/diagram/DiagramStage';
import { TeacherFigure } from '../teacher';
import { WelcomeOverlay } from './WelcomeOverlay';
import { LoadingOverlay } from './LoadingOverlay';
import { ClassroomErrorBanner } from './ClassroomErrorBanner';
import { SubtitleBar } from './SubtitleBar';
import type { ClassroomMainStageProps } from './stage.types';

export const ClassroomMainStage = memo(function ClassroomMainStage({
  className = '',
}: ClassroomMainStageProps) {
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const chunks = useAppSelector((s) => s.classroom.chunks);
  const error = useAppSelector((s) => s.classroom.error);
  const loadingStatus = useAppSelector((s) => s.classroom.loadingStatus);
  const diagramType = useAppSelector((s) => s.classroom.diagramType);
  const currentCommand = useAppSelector((s) => s.classroom.currentCommand);
  const currentFormula = useAppSelector((s) => s.classroom.currentFormula);

  const isWelcomeVisible = !loading && !isPlaying && chunks.length === 0;

  return (
    <main
      className={`flex-1 flex flex-col items-center justify-center relative p-4 md:p-8 overflow-hidden h-full ${className}`}
    >
      {/* Main Whiteboard Stage Container */}
      <div className="w-full h-full max-w-6xl max-h-[720px] relative flex items-center justify-center">
        {diagramType !== 'default' ? (
          <div className="w-full h-full flex gap-6">
            <div className="w-1/2 h-full">
              <SplitWhiteboardStage />
            </div>
            <div className="w-1/2 h-full glass-floating rounded-3xl overflow-hidden relative shadow-2xl">
              <DiagramStage
                diagramType={diagramType}
                command={currentCommand}
                formula={currentFormula}
              />
            </div>
          </div>
        ) : (
          <SplitWhiteboardStage />
        )}
      </div>

      {/* 3D Teacher Avatar Integration Overlay */}
      <TeacherFigure />

      {/* Welcome Overlay (Idle State) */}
      <WelcomeOverlay isVisible={isWelcomeVisible} />

      {/* Loading Overlay (Lesson Generation State) */}
      <LoadingOverlay isLoading={loading} loadingStatus={loadingStatus} />

      {/* Error Alert Banner */}
      <ClassroomErrorBanner error={error} />

      {/* Subtitles Bar */}
      <SubtitleBar />
    </main>
  );
});

ClassroomMainStage.displayName = 'ClassroomMainStage';
