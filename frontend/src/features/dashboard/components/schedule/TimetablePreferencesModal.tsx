'use client';

import { memo } from 'react';
import { TimetableCourseSelector } from './TimetableCourseSelector';
import { DashboardDialog } from '../modals/DashboardDialog';
import { TimetableCustomHoursFields } from './TimetableCustomHoursFields';
import { useTimetablePreferencesModal } from '../../hooks/useTimetablePreferencesModal';
import { TimetablePreferencesModalHeader } from './TimetablePreferencesModalHeader';
import { TimetableTimePreferenceSelector } from './TimetableTimePreferenceSelector';
import { TimetableMaxClassesSelector } from './TimetableMaxClassesSelector';
import { StudyPlanDays } from './StudyPlanDays';
import { TimetablePreferencesModalFooter } from './TimetablePreferencesModalFooter';
import type { TimetablePreferencesModalProps } from '../../types/schedule.types';

export const TimetablePreferencesModal = memo(
  function TimetablePreferencesModal({
    error,
    isOpen,
    onClose,
    onSubmitPreferences,
    isLoading = false,
  }: TimetablePreferencesModalProps) {
    const {
      courseIds, toggleCourse, courseOptions, coursesLoading, coursesError,
      preferredTime,
      customStartTime, setCustomStartTime, customEndTime, setCustomEndTime, timeError,
      setPreferredTime,
      maxClassesPerDay,
      setMaxClassesPerDay,
      studyDays, toggleStudyDay,
      handleSubmit,
    } = useTimetablePreferencesModal({
      onSubmitPreferences,
    });

    if (!isOpen) return null;

    return (
      <DashboardDialog title="Create class timetable" onClose={onClose} className="max-w-[36rem] p-5 sm:p-6 space-y-6">
          {/* Header */}
          {error && <p role="alert" className="text-sm text-dashboard-danger">{error}</p>}
          <TimetablePreferencesModalHeader onClose={onClose} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <TimetableCourseSelector courses={courseOptions} selectedIds={courseIds} onToggle={toggleCourse} isLoading={coursesLoading} hasError={coursesError} />
            {timeError && <p role="alert" className="text-sm text-dashboard-danger">{timeError}</p>}
            {/* 1. Time of Day Preference */}
            <TimetableTimePreferenceSelector
              preferredTime={preferredTime}
              onSelectTime={setPreferredTime}
            />

            <TimetableCustomHoursFields
              preferredTime={preferredTime}
              onSelectTime={setPreferredTime}
              startTime={customStartTime}
              onStartTimeChange={setCustomStartTime}
              endTime={customEndTime}
              onEndTimeChange={setCustomEndTime}
              error={null}
            />

            {/* 2. Maximum Classes per Day */}
            <TimetableMaxClassesSelector
              maxClassesPerDay={maxClassesPerDay}
              onSelectMaxClasses={setMaxClassesPerDay}
            />

            {/* 3. Study Days Preference */}
            <StudyPlanDays label="Class days" days={studyDays} onToggle={toggleStudyDay} />

            {/* Footer Actions */}
            <TimetablePreferencesModalFooter
              onClose={onClose}
              isLoading={isLoading}
            />
          </form>
      </DashboardDialog>
    );
  }
);

TimetablePreferencesModal.displayName = 'TimetablePreferencesModal';
