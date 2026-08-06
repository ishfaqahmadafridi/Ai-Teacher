'use client';

import { memo } from 'react';
import { LessonNavigatorHeader } from './LessonNavigatorHeader';
import { ActiveLessonTree } from './ActiveLessonTree';
import { StudentsCard } from './StudentsCard';
import { NavTabList } from './NavTabList';
import { KeyPointsPanel } from './KeyPointsPanel';
import type { SidebarProps } from './sidebar.types';

export const Sidebar = memo(function Sidebar({
  onAsk,
  loading,
  isPlaying,
}: SidebarProps) {
  return (
    <aside className="hidden lg:flex flex-col w-80 shrink-0 bg-[#1a1c20]/40 backdrop-blur-md border-r border-white/10 overflow-y-auto font-['Hanken_Grotesk',sans-serif] h-full">
      {/* Header Navigator Title */}
      <LessonNavigatorHeader
        title="Lesson Navigator"
        moduleSubtitle="Module 4: Theoretical Physics"
      />

      {/* Main Content Scroll Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Active Module Tree (Today's Lesson) */}
        <ActiveLessonTree />

        {/* Students Summary Card */}
        <StudentsCard />

        {/* Navigation Tabs List */}
        <NavTabList />

        {/* Live Key Points */}
        <KeyPointsPanel isPlaying={isPlaying ?? false} />
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
