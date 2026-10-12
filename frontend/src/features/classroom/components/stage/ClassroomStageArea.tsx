'use client';

import { memo } from 'react';
import { useClassroomStageArea } from '../../hooks/useClassroomStageArea';
import { ClassroomStageGrid } from './ClassroomStageGrid';
import { StageOverlayGroup } from './StageOverlayGroup';
import { SubtitleBar } from './SubtitleBar';

export const ClassroomStageArea = memo(function ClassroomStageArea() {
  useClassroomStageArea();
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
