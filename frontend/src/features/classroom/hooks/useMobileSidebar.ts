'use client';

import { useCallback } from 'react';
import { useUIStore } from '@/store/uiStore';

export function useMobileSidebar() {
  const mobileSidebarOpen = useUIStore((s) => s.mobileSidebarOpen);
  const setMobileSidebarOpen = useUIStore((s) => s.setMobileSidebarOpen);

  const handleClose = useCallback(() => {
    setMobileSidebarOpen(false);
  }, [setMobileSidebarOpen]);

  return {
    isOpen: mobileSidebarOpen,
    handleClose,
  };
}
