'use client';

import { useState, useCallback } from 'react';
import { DEFAULT_ATTENDANCE_SUMMARY } from '../constants/sidebarConstants';

export interface UseStudentsCardOptions {
  presentCount?: number;
  totalCount?: number;
  absentCount?: number;
}

export function useStudentsCard(options: UseStudentsCardOptions = {}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const total = options.totalCount ?? DEFAULT_ATTENDANCE_SUMMARY.total;
  const present = options.presentCount ?? DEFAULT_ATTENDANCE_SUMMARY.present;
  const absent = options.absentCount ?? DEFAULT_ATTENDANCE_SUMMARY.absent;

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  return {
    isExpanded,
    total,
    present,
    absent,
    toggleExpand,
  };
}
