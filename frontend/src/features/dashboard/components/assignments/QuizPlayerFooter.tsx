'use client';

import { memo } from 'react';
import { ArrowRight } from 'lucide-react';
import type { QuizPlayerFooterProps } from '../../types/assignments.types';

export const QuizPlayerFooter = memo(function QuizPlayerFooter({
  currentQuestionIndex,
  totalQuestions,
  onPrevQuestion,
  onNextQuestion,
  onSubmitQuiz,
  className = '',
}: QuizPlayerFooterProps) {
  const isLastQuestion = currentQuestionIndex >= totalQuestions - 1;

  return (
    <div className={`flex items-center justify-between pt-4 border-t border-[#1E293B] ${className}`}>
      <button
        type="button"
        onClick={onPrevQuestion}
        disabled={currentQuestionIndex === 0}
        className="px-4 py-2 rounded-xl bg-[#1E293B] text-[#94A3B8] hover:text-white font-bold text-xs disabled:opacity-40 cursor-pointer"
      >
        Previous
      </button>

      {isLastQuestion ? (
        <button
          type="button"
          onClick={onSubmitQuiz}
          className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs shadow-lg cursor-pointer"
        >
          Submit & Complete Quiz
        </button>
      ) : (
        <button
          type="button"
          onClick={onNextQuestion}
          className="px-6 py-2.5 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <span>Next Question</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

QuizPlayerFooter.displayName = 'QuizPlayerFooter';
