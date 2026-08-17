'use client';

import { useTimeGreeting } from './useTimeGreeting';
import type { UseDashboardHeroSectionOptions } from '../types/hero.types';

/**
 * Custom hook for DashboardHeroSection.
 * Handles dynamic time greeting resolution and hero section state.
 */
export function useDashboardHeroSection(options: UseDashboardHeroSectionOptions = {}) {
  const { greeting: customGreeting } = options;
  const timeGreeting = useTimeGreeting();

  const greeting = customGreeting || timeGreeting;

  return {
    greeting,
  };
}
