'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { useCountrySelect } from '../../hooks/useCountrySelect';
import type { CountrySelectProps } from '../../types';
import { CountrySearchInput, CountryDropdownMenu } from './country';

export const CountrySelect = memo(function CountrySelect({
  value,
  onChange,
  className = '',
}: CountrySelectProps) {
  const {
    query,
    isOpen,
    filteredCountries,
    containerRef,
    handleInputChange,
    handleToggleOpen,
    handleSelectCountry,
  } = useCountrySelect({ value, onChange });

  return (
    <div ref={containerRef} className={`space-y-2 relative ${className}`}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Country
      </Label>

      {/* Search Input & Down Arrow Toggle Subcomponent */}
      <CountrySearchInput
        query={query}
        isOpen={isOpen}
        onInputChange={handleInputChange}
        onToggleOpen={handleToggleOpen}
      />

      {/* Dropdown Options Popup Subcomponent */}
      <CountryDropdownMenu
        isOpen={isOpen}
        query={query}
        filteredCountries={filteredCountries}
        onSelectCountry={handleSelectCountry}
      />
    </div>
  );
});

CountrySelect.displayName = 'CountrySelect';
