'use client';

import { memo } from 'react';
import { useClassScheduleSection } from '../../hooks/useClassScheduleSection';
import { ScheduleHeaderBanner } from './ScheduleHeaderBanner';
import { ScheduleTimelineView } from './ScheduleTimelineView';
import { ScheduleWeeklyGrid } from './ScheduleWeeklyGrid';
import { ScheduledClassNoticeModal } from './ScheduledClassNoticeModal';
import { TimetablePreferencesModal } from './TimetablePreferencesModal';
import { TimetableSuggestionReviewModal } from './TimetableSuggestionReviewModal';
import { CreateScheduleSlotModal } from './CreateScheduleSlotModal';
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
    selectedNoticeItem,
    setSelectedNoticeItem,
    handleCloseNotice,
    isManualCreateOpen,
    openManualCreate,
    closeManualCreate,
    handleAddScheduleSlot,
    isPreferencesOpen,
    isReviewOpen,
    isLoading,
    suggestedTimetable,
    openPreferences,
    closePreferences,
    closeReview,
    submitPreferences,
    acceptTimetable,
    customizeSlot,
  } = useClassScheduleSection(options);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Top Banner Header & View Mode Switcher */}
      <ScheduleHeaderBanner
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenAiPlanner={openPreferences}
        onOpenManualCreate={openManualCreate}
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

      {/* Manual Add / Create Class Slot Modal */}
      <CreateScheduleSlotModal
        isOpen={isManualCreateOpen}
        onClose={closeManualCreate}
        onAddScheduleSlot={handleAddScheduleSlot}
      />

      {/* Step 1: AI Timetable Preferences Modal */}
      <TimetablePreferencesModal
        isOpen={isPreferencesOpen}
        onClose={closePreferences}
        onSubmitPreferences={submitPreferences}
        isLoading={isLoading}
      />

      {/* Step 2: AI Suggested Timetable Review Modal */}
      <TimetableSuggestionReviewModal
        isOpen={isReviewOpen}
        suggestion={suggestedTimetable}
        onClose={closeReview}
        onAcceptTimetable={acceptTimetable}
        onCustomizeSlot={customizeSlot}
      />
    </div>
  );
});

ClassScheduleSection.displayName = 'ClassScheduleSection';



