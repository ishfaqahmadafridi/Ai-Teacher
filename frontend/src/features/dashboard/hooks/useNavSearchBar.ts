'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [groupedResults, setGroupedResults] = useState<SearchGroupedResults>(EMPTY_RESULTS);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Debounced API search with AbortController cancellation for senior-level race condition protection
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setGroupedResults(EMPTY_RESULTS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const timer = setTimeout(() => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      fetchSearchResultsFromBackend(trimmed, controller.signal)
        .then((results) => {
          setGroupedResults(results);
          setIsLoading(false);
        })
        .catch((err) => {
          if (err.name !== 'AbortError') {
            setIsLoading(false);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [searchQuery]);

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
    setGroupedResults(EMPTY_RESULTS);
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
