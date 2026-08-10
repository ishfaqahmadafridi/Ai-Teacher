'use client';

import { useState, useCallback } from 'react';
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
  const [isRegisterCourseModalOpen, setIsRegisterCourseModalOpen] = useState(false);
  const [registeredCourses, setRegisteredCourses] = useState<RegisteredCourseItem[]>(
    DEFAULT_REGISTERED_COURSES
  );

  const continueLearning = DEFAULT_CONTINUE_LEARNING;
  const liveClasses = DEFAULT_LIVE_CLASSES;
  const assignments = DEFAULT_ASSIGNMENTS;
  const navLinks = DEFAULT_DASHBOARD_NAV_LINKS;

  const handleSearchChange = useCallback((val: string) => {
    setSearchQuery(val);
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
        handleOpenProfile();
      }
    },
    [handleOpenProfile]
  );

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
    isRegisterCourseModalOpen,
    registeredCourses,
    continueLearning,
    liveClasses,
    assignments,
    navLinks,
    handleSearchChange,
    handleSelectTab,
    handleOpenProfile,
    handleCloseProfile,
    handleSaveProfile,
    handleOpenRegisterCourseModal,
    handleCloseRegisterCourseModal,
    handleRegisterCourse,
    handleJoinClass,
    handleResumeCourse,
  };
}
