'use client';

import { memo } from 'react';
import { useClassScheduleSection } from '../../hooks/useClassScheduleSection';
import { ScheduleHeaderBanner } from './ScheduleHeaderBanner';
import { ScheduleTimelineView } from './ScheduleTimelineView';
import { ScheduleWeeklyGrid } from './ScheduleWeeklyGrid';
import type { ClassScheduleSectionProps } from '../../types/schedule.types';

export const ClassScheduleSection = memo(function ClassScheduleSection({
  scheduleItems,
  onJoinClass,
  className = '',
}: ClassScheduleSectionProps) {
  const {
    days,
    selectedDay,
    setSelectedDay,
    viewMode,
    setViewMode,
    scheduleItems: items,
  } = useClassScheduleSection({ scheduleItems });

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
          scheduleItems={items}
          onJoinClass={onJoinClass}
        />
      ) : (
        <ScheduleWeeklyGrid
          scheduleItems={items}
          onJoinClass={onJoinClass}
        />
      )}
    </div>
  );
});

ClassScheduleSection.displayName = 'ClassScheduleSection';
