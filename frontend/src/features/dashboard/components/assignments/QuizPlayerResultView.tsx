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
    <div className={`p-6 rounded-3xl bg-[#090D16] border border-[#8B5CF6]/40 text-center space-y-4 ${className}`}>
      <div className="w-16 h-16 rounded-3xl bg-[#8B5CF6]/20 border border-[#8B5CF6] text-[#C4B5FD] flex items-center justify-center mx-auto shadow-xl">
        <Trophy className="w-8 h-8" />
      </div>

      <div>
        <h4 className="font-['Hanken_Grotesk',sans-serif] text-2xl font-black text-white">
          Quiz Completed!
        </h4>
        <p className="text-xs text-[#94A3B8] mt-1">
          Your answers have been evaluated and recorded into the GCR system.
        </p>
      </div>

      <div className="inline-flex items-center gap-4 p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B]">
        <div>
          <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
            Score Achieved
          </div>
          <div className="font-mono text-3xl font-bold text-[#10B981]">
            {quizResult.earnedScore} / {quizResult.maxPossibleScore}
          </div>
        </div>
        <div className="border-l border-[#1E293B] pl-4">
          <div className="text-[10px] text-[#64748B] font-bold uppercase tracking-wider">
            Percentage
          </div>
          <div className="font-mono text-3xl font-bold text-[#C4B5FD]">
            {quizResult.percentage}%
          </div>
        </div>
      </div>

      <div className="pt-4">
        <button
          type="button"
          onClick={onFinishAndClose}
          className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs shadow-xl cursor-pointer"
        >
          Close & Return to Dashboard
        </button>
      </div>
    </div>
  );
});

QuizPlayerResultView.displayName = 'QuizPlayerResultView';
