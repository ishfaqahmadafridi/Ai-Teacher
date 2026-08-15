'use client';

import { useState, useCallback } from 'react';
import { useOnboarding } from './useOnboarding';

export function useStep6Interests() {
  const { selectedInterests, toggleInterest, submitInterests } = useOnboarding();
  const [searchQuery, setSearchQuery] = useState('');
  const [customInput, setCustomInput] = useState('');

  const handleAddCustomSubject = useCallback(
    (subjectToAdd: string) => {
      const trimmed = subjectToAdd.trim();
      if (!trimmed) return;
      if (!selectedInterests.includes(trimmed)) {
        toggleInterest(trimmed);
      }
      setCustomInput('');
      setSearchQuery('');
    },
    [selectedInterests, toggleInterest]
  );

  return {
    selectedInterests,
    searchQuery,
    customInput,
    toggleInterest,
    submitInterests,
    setSearchQuery,
    setCustomInput,
    handleAddCustomSubject,
  };
}
