'use client';

import { memo } from 'react';
import { Check } from 'lucide-react';
import type { CountryDropdownMenuProps } from '../../../types';

export const CountryDropdownMenu = memo(function CountryDropdownMenu({
  isOpen,
  query,
  filteredCountries,
  onSelectCountry,
}: CountryDropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div className="absolute left-0 right-0 top-full mt-1.5 max-h-60 overflow-y-auto bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl z-50 p-1.5 space-y-0.5 backdrop-blur-xl animate-in fade-in duration-150">
      {filteredCountries.length > 0 ? (
        filteredCountries.map((c) => {
          const isSelected = query.toLowerCase().includes(c.name.toLowerCase());
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCountry(c)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#2563EB]/25 text-white border border-[#2563EB]/40'
                  : 'text-[#94A3B8] hover:bg-white/10 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-base leading-none">{c.flag}</span>
                <span className="text-sm">{c.name}</span>
              </div>
              {isSelected && <Check className="w-4 h-4 text-[#38BDF8]" />}
            </button>
          );
        })
      ) : (
        <div className="px-4 py-3 text-xs text-[#94A3B8] text-center font-medium">
          Custom Country: &quot;{query}&quot;
        </div>
      )}
    </div>
  );
});

CountryDropdownMenu.displayName = 'CountryDropdownMenu';
