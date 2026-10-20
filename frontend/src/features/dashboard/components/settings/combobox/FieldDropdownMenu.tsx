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
    <div className={`absolute top-full left-0 right-0 mt-1.5 bg-dashboard-panel border border-dashboard-border rounded-xl shadow-none z-50 max-h-56 overflow-y-auto p-1.5 space-y-1 font-['Hanken_Grotesk',sans-serif] ${className}`}>
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
                  ? 'bg-dashboard-selected text-dashboard-primary'
                  : 'text-dashboard-muted hover:bg-dashboard-subtle hover:text-dashboard-text'
              }`}
            >
              <span className="truncate">{field}</span>
              {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-dashboard-primary" />}
            </button>
          );
        })
      ) : (
        <button
          type="button"
          onClick={() => onSelectField(query)}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-dashboard-primary hover:bg-dashboard-subtle text-left transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">Use custom entry: &quot;{query}&quot;</span>
        </button>
      )}
    </div>
  );
});

FieldDropdownMenu.displayName = 'FieldDropdownMenu';
