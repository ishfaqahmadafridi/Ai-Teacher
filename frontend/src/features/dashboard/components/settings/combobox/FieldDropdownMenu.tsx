'use client';

import { memo } from 'react';
import { Check, Plus } from 'lucide-react';
import type { FieldDropdownMenuProps } from '../../../types/settings.types';

export const FieldDropdownMenu = memo(function FieldDropdownMenu({
  isOpen,
  query,
  filteredFields,
  onSelectField,
  className = '',
}: FieldDropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className={`absolute top-full left-0 right-0 mt-1.5 bg-[#0F172A] border border-[#1E293B] rounded-xl shadow-2xl z-50 max-h-56 overflow-y-auto p-1.5 space-y-1 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {filteredFields.length > 0 ? (
        filteredFields.map((field) => {
          const isSelected = query.trim().toLowerCase() === field.toLowerCase();
          return (
            <button
              key={field}
              type="button"
              onClick={() => onSelectField(field)}
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
          onClick={() => onSelectField(query)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-[#38BDF8] hover:bg-[#1E293B] text-left transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Use custom entry: "{query}"</span>
        </button>
      )}
    </div>
  );
});

FieldDropdownMenu.displayName = 'FieldDropdownMenu';
