'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentProfile } from './useStudentProfile';
import {
  DEFAULT_CONTINUE_LEARNING,
  DEFAULT_LIVE_CLASSES,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_DASHBOARD_NAV_LINKS,
} from '../constants/dashboardConstants';

export function useDashboard() {
  const router = useRouter();
  const {
    profile,
    isProfileOpen,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
  } = useStudentProfile();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState('dashboard');

  const continueLearning = DEFAULT_CONTINUE_LEARNING;
  const liveClasses = DEFAULT_LIVE_CLASSES;
  const assignments = DEFAULT_ASSIGNMENTS;
  const navLinks = DEFAULT_DASHBOARD_NAV_LINKS;

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
  }, []);

  const handleSelectTab = useCallback(
    (id: string) => {
      setActiveTabId(id);
      if (id === 'settings') {
        handleOpenProfile();
      }
    },
    [handleOpenProfile]
  );

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
    isProfileOpen,
    continueLearning,
    liveClasses,
    assignments,
    navLinks,
    handleSearchChange,
    handleSelectTab,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
    handleJoinClass,
    handleResumeCourse,
  };
}
