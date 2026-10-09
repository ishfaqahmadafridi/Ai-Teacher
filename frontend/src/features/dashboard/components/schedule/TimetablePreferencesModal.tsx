'use client';

import { memo } from 'react';
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-xl p-6 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl space-y-6">
          {/* Header */}
          {error && <p role="alert" className="text-sm text-red-400">{error}</p>}
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
        </div>
      </div>
    );
  }
);

TimetablePreferencesModal.displayName = 'TimetablePreferencesModal';
