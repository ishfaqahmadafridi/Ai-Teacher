'use client';
import { useCallback, useEffect } from 'react';
import { useClassroomSidebar } from './useClassroomSidebar';
import { useMobileSidebar } from './useMobileSidebar';
import type { SidebarProps } from '../types/sidebar.types';

export function useMobileClassroomSidebar(onAsk: SidebarProps['onAsk']) {
  const { isOpen, handleClose } = useMobileSidebar();
  const sidebar = useClassroomSidebar();
  const { handleSelectTopic } = sidebar;
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [handleClose]);
  const selectTopic = useCallback((id: string) => {
    handleSelectTopic(id);
    handleClose();
  }, [handleSelectTopic, handleClose]);
  const ask = useCallback((question: string) => {
    onAsk?.(question);
    handleClose();
  }, [onAsk, handleClose]);
  return { ...sidebar, isOpen, handleClose, selectTopic, ask };
}
