'use client';

import { useAuthStore } from '@/features/auth/state/authStore';
import { useScheduleClock } from './useScheduleClock';
import { getHeroAppearance } from '../utilities/heroAppearance';
import type { UseDashboardHeroSectionOptions } from '../types/hero.types';

/**
 * Custom hook for DashboardHeroSection.
 * Handles dynamic time greeting resolution and hero section state.
 */
export function useDashboardHeroSection(options: UseDashboardHeroSectionOptions = {}) {
  const { greeting: customGreeting } = options;
  const timezone = useAuthStore((state) => state.user?.timezone);
  const now = useScheduleClock();
  const appearance = getHeroAppearance(new Date(now || 0), now ? timezone : 'UTC');

  const greeting = customGreeting || appearance.greeting;

  return {
    greeting,
    imageSrc: appearance.imageSrc,
    imageAlt: appearance.imageAlt,
    sceneStyle: appearance.sceneStyle,
  };
}
