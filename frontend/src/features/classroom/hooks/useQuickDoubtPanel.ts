'use client';

import { useState, useCallback } from 'react';

export interface UseQuickDoubtPanelProps {
  onAsk?: (question: string) => void;
}

export function useQuickDoubtPanel({ onAsk }: UseQuickDoubtPanelProps = {}) {
  const [query, setQuery] = useState('');

  const quickPrompts = [
    'Explain F = m · a in simple terms',
    'Show real-world example of 3rd Law',
    'What is difference between mass & weight?',
    'Give me a practice physics problem',
  ];

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (query.trim() && onAsk) {
        onAsk(query.trim());
        setQuery('');
      }
    },
    [query, onAsk]
  );

  const handlePromptClick = useCallback(
    (promptText: string) => {
      if (onAsk) {
        onAsk(promptText);
      }
    },
    [onAsk]
  );

  return {
    query,
    setQuery,
    quickPrompts,
    handleSubmit,
    handlePromptClick,
  };
}
