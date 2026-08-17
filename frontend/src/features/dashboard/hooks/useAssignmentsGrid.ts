'use client';

import { useMemo } from 'react';
import type { UseAssignmentsGridOptions } from '../types/assignments.types';

export function useAssignmentsGrid(options: UseAssignmentsGridOptions) {
  const { filteredItems } = options;

  const isEmpty = useMemo(() => {
    return filteredItems.length === 0;
  }, [filteredItems.length]);

  return {
    isEmpty,
  };
}
