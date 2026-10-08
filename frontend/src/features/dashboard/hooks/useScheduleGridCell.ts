'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '@/features/auth/state/authStore';
import { getScheduleAccess } from '../utilities/scheduleAccess';
import { useScheduleClock } from './useScheduleClock';
import type { UseScheduleGridCellOptions } from '../types/schedule.types';

export function useScheduleGridCell(options: UseScheduleGridCellOptions) {
  const { item, onJoinClass, onSelectNoticeItem } = options;
  const [showNotice, setShowNotice] = useState(false);

  const timezone = useAuthStore((state) => state.user?.timezone || '');
  const now = useScheduleClock();
  const access = item && now ? getScheduleAccess(item, timezone, new Date(now)) : null;
  const isLive = Boolean(access?.canJoin);
  const isEnded = Boolean(access?.ended);

  useEffect(() => {
    if (showNotice) {
      const timer = setTimeout(() => setShowNotice(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [showNotice]);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (!item || item.sessionEnded) return;

      const current = getScheduleAccess(item, timezone);
      if (current.ended) return;
      if (current.canJoin) {
        onJoinClass?.(item.id);
      } else {
        if (onSelectNoticeItem) {
          onSelectNoticeItem(item);
        } else {
          setShowNotice((prev) => !prev);
        }
      }
    },
    [timezone, item, onJoinClass, onSelectNoticeItem]
  );

  const handleCloseNotice = useCallback(() => {
    setShowNotice(false);
  }, []);

  return {
    isLive,
    isEnded,
    showNotice,
    handleClick,
    handleCloseNotice,
  };
}
