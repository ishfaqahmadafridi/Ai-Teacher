'use client';

export interface HomeState {
  isMenuOpen: boolean;
  selectedTrackId?: string;
}

export interface ActionButtonsProps {
  onGetStarted?: () => void;
  onWatchDemo?: () => void;
  className?: string;
}
