'use client';

import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import type { FieldSearchInputProps } from '../../../types/settings.types';

export const FieldSearchInput = memo(function FieldSearchInput({
  query,
  isOpen,
  placeholder = 'Type your custom major or select a field...',
  onInputChange,
  onToggleOpen,
  className = '',
}: FieldSearchInputProps) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="text"
        value={query}
        onChange={onInputChange}
        onFocus={onToggleOpen}
        placeholder={placeholder}
        className="w-full bg-dashboard-panel border border-dashboard-border rounded-xl pl-4 pr-11 py-2.5 text-sm text-dashboard-text placeholder:text-dashboard-muted focus:outline-none focus:border-dashboard-primary transition-colors"
      />

      <button
        type="button"
        onClick={onToggleOpen}
        className="absolute right-2 p-1.5 rounded-lg text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle/60 transition-colors cursor-pointer"
        aria-label="Toggle field options dropdown"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-dashboard-primary' : ''}`} />
      </button>
    </div>
  );
});

FieldSearchInput.displayName = 'FieldSearchInput';
