'use client';

import { memo } from 'react';
import { useTopBar } from '../../hooks/useTopBar';
import { CourseInfoBadge } from './CourseInfoBadge';
import { SessionProgressTimer } from './SessionProgressTimer';
import { HeaderActionGroup } from './HeaderActionGroup';
import type { TopBarProps } from '../../types/topbar.types';

export const TopBar = memo(function TopBar({
  className = '',
}: TopBarProps) {
  const { topicTitle, progressPercent, currentChunkIndex, totalChunks } = useTopBar();

  return (
    <header className={`bg-[#111318]/40 backdrop-blur-md font-['Hanken_Grotesk',sans-serif] border-b border-white/10 flex justify-between items-center px-4 md:px-8 lg:px-12 h-20 w-full z-50 sticky top-0 shrink-0 ${className}`}>
      {/* Left: Course Info Badge */}
      <CourseInfoBadge
        subjectTitle="Mathematics 101"
        chapterText="Chapter 5"
        topicTitle={topicTitle}
      />

      {/* Center: Floating Timer & Progress Capsule */}
      <SessionProgressTimer
        elapsedFormatted="42:15"
        progressPercent={progressPercent}
        currentChunkIndex={currentChunkIndex}
        totalChunks={totalChunks}
      />

      {/* Right: Quick Action Controls */}
      <HeaderActionGroup />
    </header>
  );
});

TopBar.displayName = 'TopBar';
