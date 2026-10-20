'use client';

import { memo } from 'react';
import { Trophy } from 'lucide-react';
import type { QuizPlayerResultViewProps } from '../../types/assignments.types';

export const QuizPlayerResultView = memo(function QuizPlayerResultView({
  quizResult,
  onFinishAndClose,
  className = '',
}: QuizPlayerResultViewProps) {
  return (
    <div className={`p-6 rounded-3xl bg-dashboard-panel border border-dashboard-primary/40 text-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-3xl bg-dashboard-primary/20 border border-dashboard-primary text-dashboard-primary flex items-center justify-center mx-auto shadow-none">
        <Trophy className="w-8 h-8" />
      </div>

      <div>
        <h4 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-black text-dashboard-text">
          Quiz Completed!
        </h4>
        <p className="text-xs text-dashboard-muted mt-1">
          Your answers have been evaluated and recorded into the GCR system.
        </p>
      </div>

      <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border">
        <div>
          <div className="text-[10px] text-dashboard-muted font-bold uppercase tracking-wider">
            Score Achieved
          </div>
          <div className="font-mono text-3xl font-bold text-dashboard-success">
            {quizResult.earnedScore} / {quizResult.maxPossibleScore}
          </div>
        </div>
        <div className="border-l border-dashboard-border pl-4">
          <div className="text-[10px] text-dashboard-muted font-bold uppercase tracking-wider">
            Percentage
          </div>
          <div className="font-mono text-3xl font-bold text-dashboard-primary">
            {quizResult.percentage}%
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onFinishAndClose}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-dashboard-primary hover:bg-dashboard-primary-hover text-white font-bold text-xs shadow-none cursor-pointer"
        >
          Close & Return to Dashboard
        </button>
      </div>
    </div>
  );
});

QuizPlayerResultView.displayName = 'QuizPlayerResultView';
