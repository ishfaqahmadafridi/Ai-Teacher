'use client';

import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { useLearningSummarySidebar } from '../../hooks';
import type { LearningSummarySidebarProps } from '../../types';
import {
  SidebarHeader,
  StudyModeToggle,
  SelectedFieldsList,
  PaceDurationToggle,
  SidebarActionBtn,
} from './sidebar';

export const LearningSummarySidebar = memo(function LearningSummarySidebar({
  selectedInterests,
  onToggleInterest,
  onSubmit,
  className = '',
}: LearningSummarySidebarProps) {
  const {
    studyMode,
    paceMode,
    activeFieldTitle,
    modeDescription,
    handleToggleStudyMode,
    handleTogglePaceMode,
  } = useLearningSummarySidebar({ selectedInterests });

  return (
    <aside className={`hidden md:block w-88 shrink-0 sticky top-8 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      <Card className="bg-[#070D1A]/90 border border-[#1E293B] backdrop-blur-2xl rounded-3xl p-6 space-y-5 shadow-2xl overflow-hidden relative">
        {/* Top Radial Ambient Glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-[#2563EB]/15 rounded-full blur-3xl pointer-events-none" />

        {/* 1. Header Title & Badge */}
        <SidebarHeader
          title={activeFieldTitle}
          studyMode={studyMode}
        />

        {/* 2. Study Mode Selector Toggle & Description */}
        <StudyModeToggle
          studyMode={studyMode}
          modeDescription={modeDescription}
          onToggleStudyMode={handleToggleStudyMode}
        />

        {/* 3. Selected Fields Pill List */}
        <SelectedFieldsList
          selectedInterests={selectedInterests}
          onToggleInterest={onToggleInterest}
        />

        {/* 4. Timetable Duration Toggle */}
        {studyMode === 'timetable' && (
          <PaceDurationToggle
            paceMode={paceMode}
            onTogglePaceMode={handleTogglePaceMode}
          />
        )}

        {/* 5. Action Launch Button */}
        <SidebarActionBtn
          isDisabled={selectedInterests.length === 0}
          onSubmit={onSubmit}
        />
      </Card>
    </aside>
  );
});

LearningSummarySidebar.displayName = 'LearningSummarySidebar';
