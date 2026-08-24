'use client';

import { useState, useEffect, useCallback } from 'react';
import type { UseScheduleItemCardOptions } from '../types/schedule.types';

export function useScheduleItemCard(options: UseScheduleItemCardOptions) {
  const { item, onJoinClass, onSelectNoticeItem } = options;
  const [showNotice, setShowNotice] = useState(false);

  const isLive = item.status === 'live';

  useEffect(() => {
    if (showNotice) {
      const timer = setTimeout(() => setShowNotice(false), 4500);
      return () => clearTimeout(timer);
    }
  }, [showNotice]);

  const handleClick = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      if (isLive) {
        onJoinClass?.(item.id);
      } else {
        setShowNotice((prev) => !prev);
        onSelectNoticeItem?.(item);
      }
    },
    [isLive, item, onJoinClass, onSelectNoticeItem]
  );

  const handleCloseNotice = useCallback(() => {
    setShowNotice(false);
  }, []);

  return {
    isLive,
    showNotice,
    handleClick,
    handleCloseNotice,
  };
}
