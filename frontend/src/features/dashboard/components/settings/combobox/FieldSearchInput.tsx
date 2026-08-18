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
        className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-colors"
      />

      <button
        type="button"
        onClick={onToggleOpen}
        className="absolute right-2 p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60 transition-colors cursor-pointer"
        aria-label="Toggle field options dropdown"
      >
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#38BDF8]' : ''}`} />
      </button>
    </div>
  );
});

FieldSearchInput.displayName = 'FieldSearchInput';
