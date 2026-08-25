'use client';

import { memo } from 'react';
import type { QuickDoubtPanelProps } from '../../types/sidebar.types';
import { useQuickDoubtPanel } from '../../hooks/useQuickDoubtPanel';
import { DoubtHeader, DoubtPromptList, DoubtInputForm } from './doubts';

export const QuickDoubtPanel = memo(function QuickDoubtPanel({
  onAsk,
  loading = false,
  className = '',
}: QuickDoubtPanelProps) {
  const { query, setQuery, quickPrompts, handleSubmit, handlePromptClick } =
    useQuickDoubtPanel({ onAsk });

  return (
    <div className={`space-y-3 font-sans ${className}`}>
      {/* Header */}
      <DoubtHeader />

      {/* Quick Prompt Pills List */}
      <DoubtPromptList
        prompts={quickPrompts}
        onPromptClick={handlePromptClick}
        loading={loading}
      />

      {/* Input Form */}
      <DoubtInputForm
        query={query}
        onQueryChange={setQuery}
        onSubmit={handleSubmit}
        loading={loading}
      />
    </div>
  );
});

QuickDoubtPanel.displayName = 'QuickDoubtPanel';
