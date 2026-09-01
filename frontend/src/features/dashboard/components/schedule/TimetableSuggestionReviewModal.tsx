'use client';

import { memo } from 'react';
import { useTimetableSuggestionReviewModal } from '../../hooks/useTimetableSuggestionReviewModal';
import { TimetableSuggestionReviewHeader } from './TimetableSuggestionReviewHeader';
import { TimetableSuggestionReviewGrid } from './TimetableSuggestionReviewGrid';
import { TimetableSuggestionConstraintBanner } from './TimetableSuggestionConstraintBanner';
import { TimetableSuggestionReviewFooter } from './TimetableSuggestionReviewFooter';
import type { TimetableSuggestionReviewModalProps } from '../../types/schedule.types';

export const TimetableSuggestionReviewModal = memo(
  function TimetableSuggestionReviewModal({
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
        <div className="relative w-full max-w-2xl p-6 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
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
        </div>
      </div>
    );
  }
);

TimetableSuggestionReviewModal.displayName = 'TimetableSuggestionReviewModal';

