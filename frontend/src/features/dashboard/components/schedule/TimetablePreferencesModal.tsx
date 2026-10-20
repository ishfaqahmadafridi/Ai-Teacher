'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { TimetableCustomHoursFields } from './TimetableCustomHoursFields';
import { useTimetablePreferencesModal } from '../../hooks/useTimetablePreferencesModal';
import { TimetablePreferencesModalHeader } from './TimetablePreferencesModalHeader';
import { TimetableTimePreferenceSelector } from './TimetableTimePreferenceSelector';
import { TimetableMaxClassesSelector } from './TimetableMaxClassesSelector';
import { TimetableStudyDaysSelector } from './TimetableStudyDaysSelector';
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
      preferredTime,
      customStartTime, setCustomStartTime, customEndTime, setCustomEndTime, timeError,
      setPreferredTime,
      maxClassesPerDay,
      setMaxClassesPerDay,
      includeSaturday,
      setIncludeSaturday,
      handleSubmit,
    } = useTimetablePreferencesModal({
      onSubmitPreferences,
    });

    if (!isOpen) return null;

    return (
      <DashboardDialog title="AI Timetable Planner" onClose={onClose} className="max-w-[36rem] p-5 sm:p-6 space-y-6">
          {/* Header */}
          {error && <p role="alert" className="text-sm text-dashboard-danger">{error}</p>}
          <TimetablePreferencesModalHeader onClose={onClose} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
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
              error={timeError}
            />

            {/* 2. Maximum Classes per Day */}
            <TimetableMaxClassesSelector
              maxClassesPerDay={maxClassesPerDay}
              onSelectMaxClasses={setMaxClassesPerDay}
            />

            {/* 3. Study Days Preference */}
            <TimetableStudyDaysSelector
              includeSaturday={includeSaturday}
              onSelectIncludeSaturday={setIncludeSaturday}
            />

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
