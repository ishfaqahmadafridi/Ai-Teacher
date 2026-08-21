'use client';

import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentProfile } from './useStudentProfile';
import { useDashboardData } from './useDashboardData';
import { DEFAULT_DASHBOARD_NAV_LINKS } from '../constants/dashboardConstants';
import type { NotificationItem, SearchResultItem } from '../types/topbar.types';
import type { AutoOpenTaskPayload } from '../types/assignments.types';

export function useDashboardLayout() {
  const router = useRouter();
  const {
    profile,
    isProfileOpen,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
  } = useStudentProfile();

  const {
    registeredCourses,
    liveClasses,
    assignments,
    continueLearning,
    handleRegisterCourse,
  } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTabId, setActiveTabId] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegisterCourseModalOpen, setIsRegisterCourseModalOpen] = useState(false);
  const [autoOpenTask, setAutoOpenTask] = useState<AutoOpenTaskPayload | null>(null);

  const navLinks = DEFAULT_DASHBOARD_NAV_LINKS;

  // Filter content based on active searchQuery if user types in search bar
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return registeredCourses;
    return registeredCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subjectField.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q)
    );
  }, [searchQuery, registeredCourses]);

  const filteredLiveClasses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return liveClasses;
    return liveClasses.filter(
      (lc) =>
        lc.title.toLowerCase().includes(q) ||
        lc.subject.toLowerCase().includes(q) ||
        lc.instructorName.toLowerCase().includes(q)
    );
  }, [searchQuery, liveClasses]);

  const filteredAssignments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return assignments;
    return assignments.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        (a.type ? a.type.toLowerCase().includes(q) : false)
    );
  }, [searchQuery, assignments]);

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
  }, []);

  const handleSelectSearchResult = useCallback(
    (item: SearchResultItem) => {
      const { actionPayload } = item;
      if (actionPayload.targetTab) {
        setActiveTabId(actionPayload.targetTab);
      }
      if (item.type === 'course' || item.type === 'live_class') {
        router.push('/classroom');
      } else if (item.type === 'assignment') {
        setAutoOpenTask({
          taskId: actionPayload.taskId || 'asg-101',
          modalType: item.badgeText === 'Quiz' ? 'quiz' : 'submit',
        });
        setActiveTabId('assignments_quizzes');
      }
    },
    [router]
  );

  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const handleOpenRegisterCourseModal = useCallback(() => {
    setIsRegisterCourseModalOpen(true);
  }, []);

  const handleCloseRegisterCourseModal = useCallback(() => {
    setIsRegisterCourseModalOpen(false);
  }, []);

  const handleSelectTab = useCallback(
    (id: string) => {
      setActiveTabId(id);
      if (id === 'settings') {
        handleOpenSettings();
      }
    },
    [handleOpenSettings]
  );

  const handleNotificationClick = useCallback((notification: NotificationItem) => {
    const taskId = notification.taskId || 'asg-101';
    const modalType: 'submit' | 'quiz' = notification.type === 'quiz_assigned' ? 'quiz' : 'submit';

    setAutoOpenTask({ taskId, modalType });
    setActiveTabId('assignments_quizzes');
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
    isProfileOpen,
    isSettingsOpen,
    isRegisterCourseModalOpen,
    registeredCourses: filteredCourses,
    continueLearning,
    liveClasses: filteredLiveClasses,
    assignments: filteredAssignments,
    navLinks,
    autoOpenTask,
    handleSearchChange,
    handleSelectSearchResult,
    handleSelectTab,
    handleNotificationClick,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
    handleOpenSettings,
    handleCloseSettings,
    handleOpenRegisterCourseModal,
    handleCloseRegisterCourseModal,
    handleRegisterCourse,
    handleJoinClass,
    handleResumeCourse,
  };
}
