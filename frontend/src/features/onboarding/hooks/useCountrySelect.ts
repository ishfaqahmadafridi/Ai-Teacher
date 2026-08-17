'use client';

import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { WORLD_COUNTRIES, CountryOption } from '../constants/countryConstants';

export interface UseCountrySelectProps {
  value: string;
  onChange: (val: string) => void;
}

export function useCountrySelect({ value, onChange }: UseCountrySelectProps) {
  const [query, setQuery] = useState(value || '');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync internal search query if external value changes
  useEffect(() => {
    if (value !== undefined && value !== query) {
      const match = WORLD_COUNTRIES.find(
        (c) => c.name.toLowerCase() === value.toLowerCase() || c.code.toLowerCase() === value.toLowerCase()
      );
      if (match) {
        setQuery(`${match.flag} ${match.name}`);
      } else {
        setQuery(value);
      }
    }
  }, [value]);

  // Filter countries list dynamically based on user typed query
  const filteredCountries = useMemo(() => {
    if (!query.trim()) return WORLD_COUNTRIES;
    const clean = query.replace(/^[\uD800-\uDBFF][\uDC00-\uDFFF]\s*/, '').toLowerCase().trim();
    if (!clean) return WORLD_COUNTRIES;
    return WORLD_COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(clean) ||
        c.code.toLowerCase().includes(clean)
    );
  }, [query]);

  // Typing in input updates the value cleanly without auto-opening the list
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setQuery(val);
      onChange(val);
    },
    [onChange]
  );

  // Explicitly toggle dropdown open/close when user clicks the down arrow
  const handleToggleOpen = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleSelectCountry = useCallback(
    (country: CountryOption) => {
      const formatted = `${country.flag} ${country.name}`;
      setQuery(formatted);
      onChange(country.name);
      setIsOpen(false);
    },
    [onChange]
  );

  // Handle outside click to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return {
    query,
    isOpen,
    filteredCountries,
    containerRef,
    handleInputChange,
    handleToggleOpen,
    handleSelectCountry,
    setIsOpen,
  };
}
