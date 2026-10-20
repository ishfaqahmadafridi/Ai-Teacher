'use client';

import { memo } from 'react';
import { MessageSquare, CheckCircle2, CircleAlert } from 'lucide-react';
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
      className={`bg-dashboard-panel border border-dashboard-border rounded-3xl p-6 sm:p-8 shadow-none space-y-6 ${className}`}
    >
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dashboard-border pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dashboard-subtle text-dashboard-muted text-xs font-bold uppercase tracking-wider mb-2 border border-dashboard-border">
            <MessageSquare className="w-4 h-4 text-dashboard-muted" />
            <span>Teacher Q&A Topic Relevance</span>
          </div>
          <h3 className="font-['Hanken_Grotesk',sans-serif] text-xl font-bold text-dashboard-text">
            Live Class Question History
          </h3>
        </div>

        {/* Q&A Summary Pills */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${stats.relevantCount > 0 ? 'bg-dashboard-success/5 border-dashboard-success/20 text-dashboard-success' : 'bg-dashboard-subtle border-dashboard-border text-dashboard-muted'}`}>
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{stats.relevantCount} Topic Relevant</span>
          </div>

          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold ${stats.offTopicCount > 0 ? 'bg-dashboard-warning/5 border-dashboard-warning/20 text-dashboard-warning' : 'bg-dashboard-subtle border-dashboard-border text-dashboard-muted'}`}>
            <CircleAlert className="w-3.5 h-3.5" />
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
