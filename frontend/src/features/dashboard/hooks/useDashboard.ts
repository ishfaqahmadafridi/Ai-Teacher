'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  DEFAULT_STUDENT_PROFILE,
  DEFAULT_CONTINUE_LEARNING,
  DEFAULT_LIVE_CLASSES,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_DASHBOARD_NAV_LINKS,
} from '../constants/dashboardConstants';

export function useDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState('dashboard');

  const profile = DEFAULT_STUDENT_PROFILE;
  const continueLearning = DEFAULT_CONTINUE_LEARNING;
  const liveClasses = DEFAULT_LIVE_CLASSES;
  const assignments = DEFAULT_ASSIGNMENTS;
  const navLinks = DEFAULT_DASHBOARD_NAV_LINKS;

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
  }, []);

  const handleSelectTab = useCallback((id: string) => {
    setActiveTabId(id);
  }, []);

  const handleJoinClass = useCallback(
    (_classId?: string) => {
      router.push('/classroom');
    },
    [router]
  );

  const handleResumeCourse = useCallback(
    (_courseId?: string) => {
      router.push('/classroom');
    },
    [router]
  );

  return {
    searchQuery,
    activeTabId,
    profile,
    continueLearning,
    liveClasses,
    assignments,
    navLinks,
    handleSearchChange,
    handleSelectTab,
    handleJoinClass,
    handleResumeCourse,
  };
}
