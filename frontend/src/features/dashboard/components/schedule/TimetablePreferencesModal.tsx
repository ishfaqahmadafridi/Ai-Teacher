'use client';

import { memo } from 'react';
import { useTimetablePreferencesModal } from '../../hooks/useTimetablePreferencesModal';
import { TimetablePreferencesModalHeader } from './TimetablePreferencesModalHeader';
import { TimetableTimePreferenceSelector } from './TimetableTimePreferenceSelector';
import { TimetableMaxClassesSelector } from './TimetableMaxClassesSelector';
import { TimetableStudyDaysSelector } from './TimetableStudyDaysSelector';
import { TimetablePreferencesModalFooter } from './TimetablePreferencesModalFooter';
import type { TimetablePreferencesModalProps } from '../../types/schedule.types';

export const TimetablePreferencesModal = memo(
  function TimetablePreferencesModal({
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
          <TimetablePreferencesModalHeader onClose={onClose} />

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 1. Time of Day Preference */}
            <TimetableTimePreferenceSelector
              preferredTime={preferredTime}
              onSelectTime={setPreferredTime}
            />

            <div className="space-y-3">
              <button type="button" aria-pressed={preferredTime === 'custom'} onClick={() => setPreferredTime('custom')} className={`w-full rounded-xl border p-3 text-left text-sm font-semibold ${preferredTime === 'custom' ? 'border-purple-500 bg-purple-600/20 text-white' : 'border-slate-700 text-slate-300'}`}>Custom study hours — choose your own time</button>
              {preferredTime === 'custom' && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-2 text-sm text-slate-300">Start time<input type="time" required value={customStartTime} onChange={(e) => setCustomStartTime(e.target.value)} className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white [color-scheme:dark]" /></label>
                  <label className="space-y-2 text-sm text-slate-300">End time<input type="time" required value={customEndTime} onChange={(e) => setCustomEndTime(e.target.value)} className="block w-full rounded-lg border border-slate-600 bg-slate-800 p-2 text-white [color-scheme:dark]" /></label>
                </div>
              )}
              {timeError && <p role="alert" className="text-sm text-red-400">{timeError}</p>}
            </div>

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
