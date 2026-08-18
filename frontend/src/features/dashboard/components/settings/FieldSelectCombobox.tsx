'use client';

import { memo } from 'react';
import { useFieldSelectCombobox } from '../../hooks/useFieldSelectCombobox';
import { FieldSearchInput, FieldDropdownMenu } from './combobox';
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
      {/* Search Input & Down Arrow Button */}
      <FieldSearchInput
        query={query}
        isOpen={isOpen}
        placeholder={placeholder}
        onInputChange={handleInputChange}
        onToggleOpen={handleToggleOpen}
      />

      {/* Floating Options Dropdown Menu */}
      <FieldDropdownMenu
        isOpen={isOpen}
        query={query}
        filteredFields={filteredFields}
        onSelectField={handleSelectField}
      />
    </div>
  );
});

FieldSelectCombobox.displayName = 'FieldSelectCombobox';
