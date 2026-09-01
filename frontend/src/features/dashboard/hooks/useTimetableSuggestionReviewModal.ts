'use client';

import { useCallback } from 'react';
import type { UseTimetableSuggestionReviewModalOptions } from '../types/schedule.types';

export function useTimetableSuggestionReviewModal(
  options: UseTimetableSuggestionReviewModalOptions
) {
  const { suggestion, onAcceptTimetable, onCustomizeSlot } = options;

  const handleAccept = useCallback(() => {
    if (suggestion) {
      onAcceptTimetable(suggestion.schedule);
    }
  }, [suggestion, onAcceptTimetable]);

  const handleCustomize = useCallback(() => {
    if (onCustomizeSlot && suggestion?.schedule?.[0]) {
      const first = suggestion.schedule[0];
      onCustomizeSlot(first.id, first.dayOfWeek, first.timeFormatted);
    }
  }, [suggestion, onCustomizeSlot]);

  return {
    handleAccept,
    handleCustomize,
  };
}
