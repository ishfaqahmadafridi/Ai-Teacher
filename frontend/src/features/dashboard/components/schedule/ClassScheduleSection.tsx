'use client';

import { memo } from 'react';
import { useClassScheduleSection } from '../../hooks/useClassScheduleSection';
import { ScheduleHeaderBanner } from './ScheduleHeaderBanner';
import { ScheduleTimelineView } from './ScheduleTimelineView';
import { ScheduleWeeklyGrid } from './ScheduleWeeklyGrid';
import type { ClassScheduleSectionProps } from '../../types/schedule.types';

export const ClassScheduleSection = memo(function ClassScheduleSection(
  props: ClassScheduleSectionProps
) {
  const { onJoinClass, className = '', ...options } = props;
  const {
    days,
    selectedDay,
    setSelectedDay,
    viewMode,
    setViewMode,
    scheduleItems,
  } = useClassScheduleSection(options);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Banner Header & View Mode Switcher */}
      <ScheduleHeaderBanner
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {/* Main Schedule Content View */}
      {viewMode === 'timeline' ? (
        <ScheduleTimelineView
          days={days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          scheduleItems={scheduleItems}
          onJoinClass={onJoinClass}
        />
      ) : (
        <ScheduleWeeklyGrid
          scheduleItems={scheduleItems}
          onJoinClass={onJoinClass}
        />
      )}
    </div>
  );
});

ClassScheduleSection.displayName = 'ClassScheduleSection';
