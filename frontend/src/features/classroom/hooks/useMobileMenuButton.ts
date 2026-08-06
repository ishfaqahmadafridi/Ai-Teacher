'use client';

import { useUIStore } from '@/store/uiStore';
import { useCallback } from 'react';

export function useMobileMenuButton() {
  const toggleMobileSidebar = useUIStore((s) => s.toggleMobileSidebar);

  const handleToggle = useCallback(() => {
    toggleMobileSidebar();
  }, [toggleMobileSidebar]);

  return { handleToggle };
}
