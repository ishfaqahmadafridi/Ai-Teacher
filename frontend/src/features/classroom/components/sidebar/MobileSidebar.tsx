'use client';

import { memo } from 'react';
import { useMobileSidebar } from '../../hooks/useMobileSidebar';
import { MobileDrawerBackdrop } from './MobileDrawerBackdrop';
import { MobileDrawerHeader } from './MobileDrawerHeader';
import { ActiveLessonTree } from './ActiveLessonTree';
import { StudentsCard } from './StudentsCard';
import { NavTabList } from './NavTabList';
import { KeyPointsPanel } from './KeyPointsPanel';
import type { SidebarProps } from '../../types/sidebar.types';

export const MobileSidebar = memo(function MobileSidebar({
  isPlaying,
}: SidebarProps) {
  const { isOpen, handleClose } = useMobileSidebar();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop Sub-component */}
      <MobileDrawerBackdrop onClose={handleClose} />

      {/* Drawer Container */}
      <div className="relative w-80 max-w-[85vw] bg-[#1a1c20] border-r border-white/10 flex flex-col h-full z-10 font-['Hanken_Grotesk',sans-serif]">
        {/* Drawer Header Sub-component */}
        <MobileDrawerHeader onClose={handleClose} />

        {/* Scroll Content */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          <ActiveLessonTree />
          <StudentsCard />
          <NavTabList />
          <KeyPointsPanel isPlaying={isPlaying ?? false} />
        </div>
      </div>
    </div>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
