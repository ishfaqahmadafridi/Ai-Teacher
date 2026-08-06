'use client';

import { useCallback } from 'react';
import { DEFAULT_NAV_TABS } from '../constants/sidebarConstants';

export function useNavTabList(onSelectTab?: (id: string) => void) {
  const handleTabClick = useCallback(
    (id: string) => {
      if (onSelectTab) {
        onSelectTab(id);
      }
    },
    [onSelectTab]
  );

  return {
    tabs: DEFAULT_NAV_TABS,
    handleTabClick,
  };
}
