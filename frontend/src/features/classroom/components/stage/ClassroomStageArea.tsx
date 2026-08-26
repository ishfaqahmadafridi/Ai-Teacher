'use client';

import { memo } from 'react';
import { ClassroomStageGrid } from './ClassroomStageGrid';
import { StageOverlayGroup } from './StageOverlayGroup';
import { SubtitleBar } from './SubtitleBar';

export const ClassroomStageArea = memo(function ClassroomStageArea() {
  return (
    <main className="relative flex-1 overflow-hidden font-sans">
      {/* Chalkboard & Diagram Grid Stage */}
      <ClassroomStageGrid />

      {/* Loading & Error Overlays */}
      <StageOverlayGroup />

      {/* Real-time Subtitles Bar */}
      <SubtitleBar />
    </main>
  );
});

ClassroomStageArea.displayName = 'ClassroomStageArea';
