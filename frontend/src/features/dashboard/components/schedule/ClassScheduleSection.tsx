'use client';

import { memo } from 'react';
import { useScheduleAttendance } from '../../hooks/useScheduleAttendance';
import { ScheduleStartReminder } from './ScheduleStartReminder';
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
  const { join, error: joinError } = useScheduleAttendance(onJoinClass);
  const {
    error,
    jobStatus,
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

      {(error || joinError) && <p role="alert" className="text-sm text-red-400">{error || joinError}</p>}
      {isLoading && <p role="status" className="text-sm text-slate-400">Timetable {jobStatus || 'queued'}…</p>}
      <ScheduleStartReminder items={scheduleItems} />
      {/* Main Schedule Content View */}
      {viewMode === 'timeline' ? (
        <ScheduleTimelineView
          days={days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          scheduleItems={scheduleItems}
          onJoinClass={join}
          onSelectNoticeItem={setSelectedNoticeItem}
        />
      ) : (
        <ScheduleWeeklyGrid
          scheduleItems={scheduleItems}
          onJoinClass={join}
          onSelectNoticeItem={setSelectedNoticeItem}
        />
      )}

      {/* Scheduled Class Time Notice Modal */}
      <ScheduledClassNoticeModal
        isOpen={Boolean(selectedNoticeItem)}
        item={scheduleItems.find((item) => item.id === selectedNoticeItem?.id) || selectedNoticeItem}
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
        error={error}
        isOpen={isPreferencesOpen}
        onClose={closePreferences}
        onSubmitPreferences={submitPreferences}
        isLoading={isLoading}
      />

      {/* Step 2: AI Suggested Timetable Review Modal */}
      <TimetableSuggestionReviewModal
        error={error}
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



