'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import type { UseCTAButtonReturn } from '../types/intro.types';

export function useCTAButton(onNavigateOverride?: () => void): UseCTAButtonReturn {
  const router = useRouter();
  const [ctaHovered, setCtaHovered] = useState<boolean>(false);

  const handleMouseEnter = useCallback(() => {
    setCtaHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCtaHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (onNavigateOverride) {
      onNavigateOverride();
    } else {
      router.push('/home');
    }
  }, [router, onNavigateOverride]);

  return {
    ctaHovered,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
}
