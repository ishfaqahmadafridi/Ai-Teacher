'use client';

import { memo } from 'react';
import { ListTree, FileText, HelpCircle } from 'lucide-react';
import { useMobileClassroomSidebar } from '../../../hooks/useMobileClassroomSidebar';
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
  const { isOpen, handleClose, expandedSections, activeTopicId, activeTopicTitle, subject,
    topics, toggleSection, selectTopic, ask } = useMobileClassroomSidebar(onAsk);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={handleClose}
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 z-50 bg-dashboard-subtle border-r border-dashboard-border flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header — Lecture Name & Close Button */}
        <div className="relative">
          <LectureHeader lectureTitle={activeTopicTitle} subject={subject} />
          <button
            id="mobile-sidebar-close"
            type="button"
            onClick={handleClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-dashboard-muted hover:text-dashboard-primary hover:bg-dashboard-selected transition-all cursor-pointer"
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
            badge={`${topics.length} Steps`}
            icon={ListTree}
            isExpanded={expandedSections.outline}
            onToggle={toggleSection}
          >
            <TodayOutlinePanel
            topics={topics}
              activeTopicId={activeTopicId}
              onSelectTopic={selectTopic}
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
              onAsk={ask}
              loading={loading}
            />
          </SidebarAccordionSection>
        </div>
      </aside>
    </>
  );
});

MobileSidebar.displayName = 'MobileSidebar';
