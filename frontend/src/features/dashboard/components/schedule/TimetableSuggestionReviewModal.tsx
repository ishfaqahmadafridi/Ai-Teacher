'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { useTimetableSuggestionReviewModal } from '../../hooks/useTimetableSuggestionReviewModal';
import { TimetableSuggestionReviewHeader } from './TimetableSuggestionReviewHeader';
import { TimetableSuggestionReviewGrid } from './TimetableSuggestionReviewGrid';
import { TimetableSuggestionConstraintBanner } from './TimetableSuggestionConstraintBanner';
import { TimetableSuggestionReviewFooter } from './TimetableSuggestionReviewFooter';
import type { TimetableSuggestionReviewModalProps } from '../../types/schedule.types';

export const TimetableSuggestionReviewModal = memo(
  function TimetableSuggestionReviewModal({
    error,
    isOpen,
    suggestion,
    onClose,
    onAcceptTimetable,
    onCustomizeSlot,
  }: TimetableSuggestionReviewModalProps) {
    const { handleAccept, handleCustomize } =
      useTimetableSuggestionReviewModal({
        suggestion,
        onAcceptTimetable,
        onCustomizeSlot,
      });

    if (!isOpen || !suggestion) return null;

    return (
      <DashboardDialog title="Review your timetable" onClose={onClose} className="max-w-[48rem] p-5 sm:p-6 space-y-6">
          {error && <p role="alert" className="text-sm text-dashboard-danger">{error}</p>}
          {/* Header */}
          <TimetableSuggestionReviewHeader
            optimizationSummary={suggestion.optimizationSummary}
            onClose={onClose}
          />

          {/* Schedule Preview Grid */}
          <TimetableSuggestionReviewGrid
            schedule={suggestion.schedule}
            totalWeeklyClasses={suggestion.totalWeeklyClasses}
          />

          {/* Senior-Level Decision Banner */}
          <TimetableSuggestionConstraintBanner />

          {/* Footer Actions */}
          <TimetableSuggestionReviewFooter
            onClose={onClose}
            onAccept={handleAccept}
            onCustomize={handleCustomize}
          />
      </DashboardDialog>
    );
  }
);

TimetableSuggestionReviewModal.displayName = 'TimetableSuggestionReviewModal';

