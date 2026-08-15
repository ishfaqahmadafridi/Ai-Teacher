'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../auth/state/authStore';

/**
 * Custom hook for Intro CTAButton.
 * Handles hover states and smart navigation to /dashboard or /onboarding/step-3.
 */
export function useCTAButton() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [ctaHovered, setCtaHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setCtaHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCtaHovered(false);
  }, []);

  const handleEnterPlatform = useCallback(() => {
    let hasCompletedOnboarding = false;
    if (typeof window !== 'undefined') {
      try {
        const storedOb = localStorage.getItem('onboarding-store');
        if (storedOb) {
          const parsed = JSON.parse(storedOb);
          if (parsed?.state?.selectedInterests?.length > 0 || parsed?.state?.currentStep > 3) {
            hasCompletedOnboarding = true;
          }
        }
      } catch (e) {
        console.error('Failed to parse onboarding-store from localStorage', e);
      }
    }

    if (isAuthenticated || hasCompletedOnboarding) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding/step-3');
    }
  }, [router, isAuthenticated]);

  return {
    ctaHovered,
    handleMouseEnter,
    handleMouseLeave,
    handleEnterPlatform,
  };
}
