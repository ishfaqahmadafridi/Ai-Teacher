'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/features/auth/state/authStore';
import { queryKeys, SEARCH_DEBOUNCE_TIME } from '@/shared/constants/queryConstants';
import { fetchSearchResultsFromBackend } from '../services/searchService';
import type {
  UseNavSearchBarOptions,
  SearchResultItem,
  SearchGroupedResults,
} from '../types/topbar.types';

const EMPTY_RESULTS: SearchGroupedResults = {
  courses: [],
  assignments: [],
  liveClasses: [],
  topics: [],
  totalCount: 0,
};

export function useNavSearchBar({
  searchQuery,
  onSearchChange,
  onSelectSearchResult,
}: UseNavSearchBarOptions) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const userId = useAuthStore(state => state.user?.id);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(searchQuery.trim()), SEARCH_DEBOUNCE_TIME);
    return () => clearTimeout(timer);
  }, [searchQuery]);
  const search = useQuery({
    queryKey: queryKeys.search(userId, debouncedQuery),
    enabled: !!userId && !!debouncedQuery && debouncedQuery === searchQuery.trim(),
    queryFn: ({ signal }) => fetchSearchResultsFromBackend(debouncedQuery, signal),
  });
  const groupedResults = debouncedQuery === searchQuery.trim() ? search.data ?? EMPTY_RESULTS : EMPTY_RESULTS;
  const isLoading = !!searchQuery.trim() && (debouncedQuery !== searchQuery.trim() || search.isFetching);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    if (searchQuery.trim().length > 0) {
      setIsOpen(true);
    }
  }, [searchQuery]);

  const handleInputChange = useCallback(
    (val: string) => {
      onSearchChange(val);
      if (val.trim().length > 0) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    },
    [onSearchChange]
  );

  const handleClear = useCallback(() => {
    onSearchChange('');
    setIsOpen(false);
    inputRef.current?.focus();
  }, [onSearchChange]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleSelectResult = useCallback(
    (item: SearchResultItem) => {
      setIsOpen(false);
      if (onSelectSearchResult) {
        onSelectSearchResult(item);
      }
    },
    [onSelectSearchResult]
  );

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Keyboard shortcut: Esc to close dropdown, Cmd+K / Ctrl+K to focus input
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      } else if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return {
    isOpen: isOpen && searchQuery.trim().length > 0,
    isFocused,
    isLoading,
    containerRef,
    inputRef,
    groupedResults,
    handleFocus,
    handleInputChange,
    handleClear,
    handleClose,
    handleSelectResult,
  };
}
