'use client';

import { memo, useState, useMemo } from 'react';
import { FileText, HelpCircle, CheckSquare, Calendar, CheckCircle, Flame, Sparkles, ArrowRight } from 'lucide-react';
import { DEFAULT_ASSIGNMENTS } from '../../constants/dashboardConstants';
import type { AssignmentsSectionProps, AssignmentItem } from '../../types/dashboard.types';

type FilterTab = 'all' | 'pending' | 'in_progress' | 'completed';

export const AssignmentsSection = memo(function AssignmentsSection({
  assignments = DEFAULT_ASSIGNMENTS,
  onSelectAssignment,
  onAskAiHelp,
  className = '',
}: AssignmentsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredAssignments = useMemo(() => {
    if (activeFilter === 'all') return assignments;
    return assignments.filter((item) => item.status === activeFilter);
  }, [assignments, activeFilter]);

  const counts = useMemo(() => {
    return {
      all: assignments.length,
      pending: assignments.filter((i) => i.status === 'pending').length,
      in_progress: assignments.filter((i) => i.status === 'in_progress').length,
      completed: assignments.filter((i) => i.status === 'completed').length,
    };
  }, [assignments]);

  const getIconForType = (type?: AssignmentItem['type']) => {
    switch (type) {
      case 'quiz':
        return (
          <div className="w-10 h-10 rounded-lg bg-[#712ae2]/10 text-[#712ae2] flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5" aria-hidden="true" />
          </div>
        );
      case 'practice_set':
        return (
          <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 text-[#10B981] flex items-center justify-center shrink-0">
            <CheckSquare className="w-5 h-5" aria-hidden="true" />
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" aria-hidden="true" />
          </div>
        );
    }
  };

  return (
    <section
      className={`bg-white rounded-20 p-6 card-shadow border border-[#E2E8F0]/50 font-['Hanken_Grotesk',sans-serif] ${className}`}
    >
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-[#0F172A]">
            Upcoming Assignments & Quizzes
          </h2>
          <p className="font-['Hanken_Grotesk',sans-serif] text-xs text-[#737686] mt-0.5">
            Track deadlines, complete quizzes, and get instant AI tutoring help.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F1F5F9] p-1 rounded-xl">
          {(['all', 'pending', 'in_progress', 'completed'] as FilterTab[]).map((tab) => {
            const isActive = activeFilter === tab;
            const count = counts[tab];
            const labels: Record<FilterTab, string> = {
              all: `All (${count})`,
              pending: `Pending (${count})`,
              in_progress: `In Progress (${count})`,
              completed: `Done (${count})`,
            };

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveFilter(tab)}
                className={`font-['JetBrains_Mono',monospace] text-[11px] font-semibold px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? 'bg-white text-[#004ac6] shadow-sm font-bold'
                    : 'text-[#737686] hover:text-[#0F172A]'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-3">
        {filteredAssignments.map((item) => (
          <div
            key={item.id}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]/70 hover:border-[#2563eb]/40 hover:bg-white transition-all duration-200 gap-4 group"
          >
            {/* Left Type Icon & Info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              {getIconForType(item.type)}
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-[#0F172A] group-hover:text-[#004ac6] transition-colors truncate">
                    {item.title}
                  </h4>
                  {item.isUrgent && (
                    <span className="flex items-center gap-1 font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20 px-2 py-0.5 rounded-full shrink-0">
                      <Flame className="w-3 h-3 fill-current" aria-hidden="true" />
                      High Priority
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-[#737686]">
                  <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#2563eb]">
                    {item.subject}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-[#737686]" aria-hidden="true" />
                    {item.dueDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Status, AI Tutor & Action Buttons */}
            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#475569] bg-[#E2E8F0]/60 px-2.5 py-1 rounded-md">
                {item.points} pts
              </span>

              {/* Status Indicator */}
              {item.status === 'completed' ? (
                <span className="flex items-center gap-1 font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" aria-hidden="true" />
                  Done
                </span>
              ) : item.status === 'in_progress' ? (
                <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#712ae2] bg-[#712ae2]/10 px-2.5 py-1 rounded-full">
                  In Progress
                </span>
              ) : (
                <span className="font-['JetBrains_Mono',monospace] text-[11px] font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-full">
                  Pending
                </span>
              )}

              {/* AI Help Trigger Button */}
              <button
                type="button"
                onClick={() => onAskAiHelp?.(item.title)}
                title="Ask AI Teacher for help on this assignment"
                className="hidden md:flex items-center gap-1 bg-[#712ae2]/10 hover:bg-[#712ae2]/20 text-[#712ae2] text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
                AI Assist
              </button>

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={() => onSelectAssignment?.(item.id)}
                className="bg-[#2563eb] hover:bg-[#004ac6] text-white px-3.5 py-1.5 rounded-lg font-['Hanken_Grotesk',sans-serif] font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
              >
                <span>{item.status === 'completed' ? 'Review' : item.status === 'in_progress' ? 'Resume' : 'Start'}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </div>
          </div>
        ))}

        {filteredAssignments.length === 0 && (
          <div className="text-center py-8 text-[#737686] text-sm">
            No assignments found for this filter.
          </div>
        )}
      </div>
    </section>
  );
});

AssignmentsSection.displayName = 'AssignmentsSection';
