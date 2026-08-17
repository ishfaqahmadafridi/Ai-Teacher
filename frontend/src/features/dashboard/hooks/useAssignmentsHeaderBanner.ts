'use client';

import { useMemo } from 'react';
import { getAssignmentFilterTabs } from '../constants/assignmentsConstants';
import type { UseAssignmentsHeaderBannerOptions } from '../types/assignments.types';

export function useAssignmentsHeaderBanner(options: UseAssignmentsHeaderBannerOptions) {
  const { totalCount, pendingCount } = options;

  const filterTabs = useMemo(() => {
    return getAssignmentFilterTabs(totalCount, pendingCount);
  }, [totalCount, pendingCount]);

  return {
    filterTabs,
  };
}
