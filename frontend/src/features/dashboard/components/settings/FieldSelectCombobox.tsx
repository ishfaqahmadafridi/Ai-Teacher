'use client';

import { memo } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';
import { useFieldSelectCombobox } from '../../hooks/useFieldSelectCombobox';
import type { FieldSelectComboboxProps } from '../../types/settings.types';

export const FieldSelectCombobox = memo(function FieldSelectCombobox({
  value,
  onChange,
  placeholder = 'Type your custom major or select a field...',
  className = '',
}: FieldSelectComboboxProps) {
  const {
    query,
    isOpen,
    filteredFields,
    containerRef,
    handleInputChange,
    handleToggleOpen,
    handleSelectField,
  } = useFieldSelectCombobox({ value, onChange });

  return (
    <div ref={containerRef} className={`relative w-full font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Input Field & Down Arrow Button */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => handleToggleOpen()}
          placeholder={placeholder}
          className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl pl-4 pr-11 py-2.5 text-sm text-white placeholder-[#64748B] focus:outline-none focus:border-[#38BDF8] transition-colors"
        />

        <button
          type="button"
          onClick={handleToggleOpen}
          className="absolute right-2 p-1.5 rounded-lg text-[#94A3B8] hover:text-white hover:bg-[#1E293B]/60 transition-colors cursor-pointer"
          aria-label="Toggle field options dropdown"
        >
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#38BDF8]' : ''}`} />
        </button>
      </div>

      {/* Floating Options Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-1 font-['Hanken_Grotesk',sans-serif]">
          {filteredFields.length > 0 ? (
            filteredFields.map((field) => {
              const isSelected = query.trim().toLowerCase() === field.toLowerCase();
              return (
                <button
                  key={field}
                  type="button"
                  onClick={() => handleSelectField(field)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold text-left transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB]/20 text-[#38BDF8]'
                      : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                  }`}
                >
                  <span className="truncate">{field}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#38BDF8]" />}
                </button>
              );
            })
          ) : (
            <button
              type="button"
              onClick={() => handleSelectField(query)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#38BDF8] hover:bg-[#1E293B] text-left transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Use custom entry: "{query}"</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
});

FieldSelectCombobox.displayName = 'FieldSelectCombobox';
