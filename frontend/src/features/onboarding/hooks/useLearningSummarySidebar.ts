'use client';

import { useState, useCallback, useMemo } from 'react';
import type { UseLearningSummarySidebarOptions } from '../types';

export function useLearningSummarySidebar(options: UseLearningSummarySidebarOptions) {
  const { selectedInterests } = options;
  const [studyMode, setStudyMode] = useState<'timetable' | 'self_paced'>('timetable');
  const [paceMode, setPaceMode] = useState<'4_months' | '2_months'>('4_months');

  const selectedCount = selectedInterests.length;

  // Header Title: Shows "Learning Roadmap" when no subjects selected, or dynamic subject list when selected
  const activeFieldTitle = useMemo(() => {
    if (selectedInterests.length === 0) return 'Learning Roadmap';
    return `${selectedInterests.join(' & ')} Roadmap`;
  }, [selectedInterests]);

  const handleToggleStudyMode = useCallback((mode: 'timetable' | 'self_paced') => {
    setStudyMode(mode);
  }, []);

  const handleTogglePaceMode = useCallback((mode: '4_months' | '2_months') => {
    setPaceMode(mode);
  }, []);

  // Short mode description text
  const modeDescription = useMemo(() => {
    if (studyMode === 'timetable') {
      return paceMode === '4_months'
        ? '📅 4-Month Timetable • 6 hrs/week • Guided Milestones & Quizzes'
        : '⚡ 2-Month Fast Track • 12 hrs/week • Accelerated Intensive';
    }
    return '🚀 Self-Paced Flexible Study • Learn at your own speed • 24/7 Tutor Access';
  }, [studyMode, paceMode]);

  return {
    studyMode,
    paceMode,
    activeFieldTitle,
    selectedCount,
    modeDescription,
    handleToggleStudyMode,
    handleTogglePaceMode,
  };
}
