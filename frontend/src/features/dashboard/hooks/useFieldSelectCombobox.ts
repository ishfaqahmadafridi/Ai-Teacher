'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { UseFieldSelectComboboxOptions } from '../types/settings.types';
import { PRESET_ACADEMIC_FIELDS } from '../constants/settingsConstants';

export function useFieldSelectCombobox({ value, onChange }: UseFieldSelectComboboxOptions) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Handle Outside Clicks
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredFields = PRESET_ACADEMIC_FIELDS.filter((field) =>
    field.toLowerCase().includes(query.trim().toLowerCase())
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      setIsOpen(true);
      onChange(val);
    },
    [onChange]
  );

  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelectField = useCallback(
    (field: string) => {
      setQuery(field);
      onChange(field);
      setIsOpen(false);
    },
    [onChange]
  );

  return {
    query,
    isOpen,
    filteredFields,
    containerRef,
    handleInputChange,
    handleToggleOpen,
    handleSelectField,
  };
}
