'use client';

import { memo } from 'react';
import { Sidebar, MobileSidebar } from './sidebar';
import { ClassroomStageArea } from './stage/ClassroomStageArea';
import { InputBar } from './input/InputBar';

export const ClassroomLayout = memo(function ClassroomLayout() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white font-sans">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Sidebar */}
      <MobileSidebar />

      {/* Main Container */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Classroom Stage Area */}
        <ClassroomStageArea />

        {/* Bottom Input Toolbar Area */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur px-5 py-4">
          <InputBar />
        </div>
      </div>
    </div>
  );
});

ClassroomLayout.displayName = 'ClassroomLayout';
