'use client';

import { memo } from 'react';
import { ListTree, FileText, HelpCircle } from 'lucide-react';
import { useClassroomSidebar } from '../../hooks/useClassroomSidebar';
import { LectureHeader } from './LectureHeader';
import { SidebarAccordionSection } from './SidebarAccordionSection';
import { TodayOutlinePanel } from './TodayOutlinePanel';
import { LectureNotesPanel } from './LectureNotesPanel';
import { QuickDoubtPanel } from './QuickDoubtPanel';
import type { SidebarProps } from '../../types/sidebar.types';

export const Sidebar = memo(function Sidebar({
  onAsk,
  loading = false,
}: SidebarProps) {
  const {
    expandedSections,
    activeTopicId,
    activeTopicTitle,
    toggleSection,
    handleSelectTopic,
  } = useClassroomSidebar();

  return (
    <aside className="hidden lg:flex flex-col w-80 shrink-0 bg-[#060A12]/95 backdrop-blur border-r border-slate-800/90 overflow-y-auto font-sans">
      {/* Top Header — Dynamic Active Topic Name */}
      <LectureHeader lectureTitle={activeTopicTitle} />

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
            onSelectTopic={handleSelectTopic}
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
          <QuickDoubtPanel onAsk={onAsk} loading={loading} />
        </SidebarAccordionSection>
      </div>
    </aside>
  );
});

Sidebar.displayName = 'Sidebar';
