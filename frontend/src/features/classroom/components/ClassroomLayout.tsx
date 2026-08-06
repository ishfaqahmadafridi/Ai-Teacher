'use client';

import { useClassroomLayout } from '../hooks/useClassroomLayout';
import { TopBar } from './topbar';
import { Sidebar, MobileSidebar } from './sidebar';
import { ClassroomMainStage } from './stage';
import { FloatingInteractionBar } from './input';

export function ClassroomLayout() {
  const { loading, isPlaying, sendQuestion } = useClassroomLayout();

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0A0C10] font-['Hanken_Grotesk',sans-serif] text-[#e2e2e8] relative select-none">
      {/* TopAppBar Header */}
      <TopBar />

      {/* Main Workspace Area (Split Wings) */}
      <div className="flex-1 flex w-full relative h-[calc(100vh-80px)] overflow-hidden">
        {/* Left SideNavBar Wing */}
        <Sidebar
          onAsk={sendQuestion}
          loading={loading}
          isPlaying={isPlaying}
        />

        {/* Mobile Sidebar Drawer */}
        <MobileSidebar
          onAsk={sendQuestion}
          loading={loading}
          isPlaying={isPlaying}
        />

        {/* Center Teaching Stage */}
        <ClassroomMainStage />
      </div>

      {/* Floating Bottom Interaction Bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 pointer-events-none flex justify-center pb-4">
        <div className="pointer-events-auto">
          <FloatingInteractionBar />
        </div>
      </div>
    </div>
  );
}
