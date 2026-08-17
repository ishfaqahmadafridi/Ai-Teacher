'use client';

import { useState, useCallback } from 'react';
import type { UseCTAButtonReturn } from '../types/intro.types';

export function useCTAButton(onNavigateOverride?: () => void): UseCTAButtonReturn {
  const [ctaHovered, setCtaHovered] = useState<boolean>(false);

  const handleMouseEnter = useCallback(() => {
    setCtaHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setCtaHovered(false);
  }, []);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (onNavigateOverride) {
        e?.preventDefault();
        onNavigateOverride();
      }
    },
    [onNavigateOverride]
  );

  return {
    ctaHovered,
    handleMouseEnter,
    handleMouseLeave,
    handleClick,
  };
}
