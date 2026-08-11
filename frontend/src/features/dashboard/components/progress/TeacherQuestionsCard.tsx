'use client';

import { memo } from 'react';
import { MessageSquare, CheckCircle2, AlertOctagon } from 'lucide-react';
import { QuestionItemCard } from './QuestionItemCard';
import { calculateQuestionStats } from '../../utilities/progressUtils';
import type { TeacherQuestionsCardProps } from '../../types/progress.types';

export const TeacherQuestionsCard = memo(function TeacherQuestionsCard({
  questions,
  className = '',
}: TeacherQuestionsCardProps) {
  const stats = calculateQuestionStats(questions);

  return (
    <div
      className={`bg-[#0F172A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-2 border border-[#2563EB]/30">
            <MessageSquare className="w-4 h-4 text-[#38BDF8]" />
            <span>Teacher Q&A Topic Relevance</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-white">
            Live Class Question History
          </h3>
        </div>

        {/* Q&A Summary Pills */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 text-[#10B981] text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.relevantCount} Topic Relevant</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] text-xs font-bold">
            <AlertOctagon className="w-3.5 h-3.5" />
            <span>{stats.offTopicCount} Off-Topic</span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((question) => (
          <QuestionItemCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
});

TeacherQuestionsCard.displayName = 'TeacherQuestionsCard';
