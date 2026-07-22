'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { HomeState } from '../types';

interface HomeContextType {
  state: HomeState;
  setMenuOpen: (isOpen: boolean) => void;
  setSelectedTrack: (trackId: string | undefined) => void;
}

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export function HomeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<HomeState>({
    isMenuOpen: false,
    selectedTrackId: undefined,
  });

  const setMenuOpen = (isOpen: boolean) => {
    setState((prev) => ({ ...prev, isMenuOpen: isOpen }));
  };

  const setSelectedTrack = (trackId: string | undefined) => {
    setState((prev) => ({ ...prev, selectedTrackId: trackId }));
  };

  return (
    <HomeContext.Provider value={{ state, setMenuOpen, setSelectedTrack }}>
      {children}
    </HomeContext.Provider>
  );
}

export function useHome() {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
}
