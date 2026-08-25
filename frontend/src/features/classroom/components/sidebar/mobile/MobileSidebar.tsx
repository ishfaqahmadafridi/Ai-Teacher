'use client';

import { memo, useEffect } from 'react';
import { ListTree, FileText, HelpCircle } from 'lucide-react';
import { useUIStore } from '@/store/uiStore';
import { useClassroomSidebar } from '../../../hooks/useClassroomSidebar';
import { LectureHeader } from '../LectureHeader';
import { SidebarAccordionSection } from '../SidebarAccordionSection';
import { TodayOutlinePanel } from '../TodayOutlinePanel';
import { LectureNotesPanel } from '../LectureNotesPanel';
import { QuickDoubtPanel } from '../QuickDoubtPanel';
import type { SidebarProps } from '../../../types/sidebar.types';

export const MobileSidebar = memo(function MobileSidebar({
  onAsk,
  loading = false,
}: SidebarProps) {
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const {
    expandedSections,
    activeTopicId,
    activeTopicTitle,
    toggleSection,
    handleSelectTopic,
  } = useClassroomSidebar();

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileSidebarOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setMobileSidebarOpen]);

  return (
    <>
      {/* Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 z-50 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header — Lecture Name & Close Button */}
        <div className="relative">
          <LectureHeader lectureTitle={activeTopicTitle} />
          <button
            id="mobile-sidebar-close"
            type="button"
            onClick={() => setMobileSidebarOpen(false)}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Accordion Sections List */}
        <div className="p-3.5 space-y-3.5 flex-1 overflow-y-auto">
          {/* Section 1: Today's Outline */}
          <SidebarAccordionSection
            id="outline"
            title="Today's Outline"
            badge="5 Topics"
            icon={ListTree}
            isExpanded={expandedSections.outline}
            onToggle={toggleSection}
          >
            <TodayOutlinePanel
              activeTopicId={activeTopicId}
              onSelectTopic={(id) => {
                handleSelectTopic(id);
                setMobileSidebarOpen(false);
              }}
            />
          </SidebarAccordionSection>

          {/* Section 2: Lecture Notes */}
          <SidebarAccordionSection
            id="notes"
            title="Lecture Notes & Formulas"
            badge="Current"
            icon={FileText}
            isExpanded={expandedSections.notes}
            onToggle={toggleSection}
          >
            <LectureNotesPanel activeTopicId={activeTopicId} />
          </SidebarAccordionSection>

          {/* Section 3: NEW Live Doubt Assistant (Voice & Suggestions removed) */}
          <SidebarAccordionSection
            id="doubts"
            title="Ask AI Tutor & Doubts"
            badge="Interactive"
            icon={HelpCircle}
            isExpanded={expandedSections.doubts}
            onToggle={toggleSection}
          >
            <QuickDoubtPanel
              onAsk={(q) => {
                onAsk?.(q);
                setMobileSidebarOpen(false);
              }}
              loading={loading}
            />
          </SidebarAccordionSection>
        </div>
      </aside>
    </>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
