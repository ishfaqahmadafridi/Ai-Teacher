'use client';

import { useMemo } from 'react';
import { DEFAULT_DASHBOARD_NAV_LINKS } from '../constants/sidebarConstants';
import type { UseDashboardSideNavOptions } from '../types/sidebar.types';
import { useAuthStore } from '@/features/auth/state/authStore';
import { getLearningReadiness } from '@/features/onboarding/utils/learningReadiness';

export function useDashboardSideNav(options: UseDashboardSideNavOptions = {}) {
  const { studentName = 'Student' } = options;
  const user = useAuthStore((state) => state.user);
  const { isReady } = getLearningReadiness(user);

  const mainNavLinks = useMemo(() => {
    return DEFAULT_DASHBOARD_NAV_LINKS.filter((l) => l.id !== 'settings' && (isReady || !['schedule', 'registered_courses', 'class_progress'].includes(l.id)));
  }, [isReady]);

  const settingsLink = useMemo(() => {
    return DEFAULT_DASHBOARD_NAV_LINKS.find((l) => l.id === 'settings');
  }, []);

  const firstLetter = useMemo(() => {
    return studentName ? studentName.charAt(0).toUpperCase() : 'S';
  }, [studentName]);

  return {
    mainNavLinks,
    settingsLink,
    firstLetter,
  };
}
