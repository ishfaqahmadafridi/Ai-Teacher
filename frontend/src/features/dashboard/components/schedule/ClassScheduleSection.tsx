'use client';

import { memo, useState, useCallback } from 'react';
import { useClassScheduleSection } from '../../hooks/useClassScheduleSection';
import { ScheduleHeaderBanner } from './ScheduleHeaderBanner';
import { ScheduleTimelineView } from './ScheduleTimelineView';
import { ScheduleWeeklyGrid } from './ScheduleWeeklyGrid';
import { ScheduledClassNoticeModal } from './ScheduledClassNoticeModal';
import type { ClassScheduleSectionProps, ScheduleItem } from '../../types/schedule.types';

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

  const [selectedNoticeItem, setSelectedNoticeItem] = useState<ScheduleItem | null>(null);

  const handleCloseNotice = useCallback(() => {
    setSelectedNoticeItem(null);
  }, []);

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
          onSelectNoticeItem={setSelectedNoticeItem}
        />
      ) : (
        <ScheduleWeeklyGrid
          scheduleItems={scheduleItems}
          onJoinClass={onJoinClass}
          onSelectNoticeItem={setSelectedNoticeItem}
        />
      )}

      {/* Scheduled Class Time Notice Modal */}
      <ScheduledClassNoticeModal
        isOpen={Boolean(selectedNoticeItem)}
        item={selectedNoticeItem}
        onClose={handleCloseNotice}
      />
    </div>
  );
});

ClassScheduleSection.displayName = 'ClassScheduleSection';
