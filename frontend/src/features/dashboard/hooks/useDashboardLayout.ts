'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useStudentProfile } from './useStudentProfile';
import {
  DEFAULT_CONTINUE_LEARNING,
  DEFAULT_LIVE_CLASSES,
  DEFAULT_ASSIGNMENTS,
  DEFAULT_DASHBOARD_NAV_LINKS,
  DEFAULT_REGISTERED_COURSES,
} from '../constants/dashboardConstants';
import type { RegisteredCourseItem } from '../types/courses.types';
import type { NotificationItem, SearchResultItem } from '../types/topbar.types';
import type { AutoOpenTaskPayload } from '../types/assignments.types';
import type { ContinueLearningCourse } from '../types/dashboard.types';

export function useDashboardLayout() {
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isRegisterCourseModalOpen, setIsRegisterCourseModalOpen] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourseItem[]>(
    DEFAULT_REGISTERED_COURSES
  );
  const [continueLearning, setContinueLearning] = useState<ContinueLearningCourse>(
    DEFAULT_CONTINUE_LEARNING
  );
  const [autoOpenTask, setAutoOpenTask] = useState<AutoOpenTaskPayload | null>(null);

  // Dynamic synchronization of selected onboarding interests into Active Learning Field banner
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedOb = localStorage.getItem('onboarding-store');
        if (storedOb) {
          const parsed = JSON.parse(storedOb);
          const interests: string[] = parsed?.state?.selectedInterests || [];
          if (interests.length > 0) {
            setContinueLearning({
              id: 'c1',
              title: interests.slice(0, 3).join(' & '),
              chapter: '',
              progressPercent: 75,
            });
          }
        }
      } catch (e) {
        console.error('Failed to parse selectedInterests from onboarding-store', e);
      }
    }
  }, []);

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
    if (!q) return DEFAULT_LIVE_CLASSES;
    return DEFAULT_LIVE_CLASSES.filter(
      (lc) =>
        lc.title.toLowerCase().includes(q) ||
        lc.subject.toLowerCase().includes(q) ||
        lc.instructorName.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const filteredAssignments = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return DEFAULT_ASSIGNMENTS;
    return DEFAULT_ASSIGNMENTS.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.subject.toLowerCase().includes(q) ||
        (a.type ? a.type.toLowerCase().includes(q) : false)
    );
  }, [searchQuery]);

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

  const handleRegisterCourse = useCallback(
    (courseData: {
      subjectField: string;
      title: string;
      courseCode: string;
      creditHours: number;
    }) => {
      const newCourseItem: RegisteredCourseItem = {
        id: `rc_${Date.now()}`,
        title: courseData.title,
        subjectField: courseData.subjectField,
        courseCode: courseData.courseCode,
        creditHours: courseData.creditHours,
        progressPercent: 0,
        completedLessons: 0,
        totalLessons: 12,
        enrolledDate: 'Just Now',
        status: 'active',
      };
      setRegisteredCourses((prev) => [newCourseItem, ...prev]);
    },
    []
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

