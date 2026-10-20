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
    <div className={`flex items-center justify-between pt-4 border-t border-dashboard-border ${className}`}>
      <button
        type="button"
        onClick={onPrevQuestion}
        disabled={currentQuestionIndex === 0}
        className="px-4 py-2 rounded-xl bg-dashboard-subtle text-dashboard-muted hover:text-dashboard-text font-bold text-xs disabled:opacity-40 cursor-pointer"
      >
        Previous
      </button>

      {isLastQuestion ? (
        <button
          type="button"
          onClick={onSubmitQuiz}
          className="px-6 py-2.5 rounded-xl bg-dashboard-success hover:bg-dashboard-success text-white font-bold text-xs shadow-none cursor-pointer"
        >
          Submit & Complete Quiz
        </button>
      ) : (
        <button
          type="button"
          onClick={onNextQuestion}
          className="px-6 py-2.5 rounded-xl bg-dashboard-primary hover:bg-dashboard-primary-hover text-white font-bold text-xs flex items-center gap-2 cursor-pointer"
        >
          <span>Next Question</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
});

QuizPlayerFooter.displayName = 'QuizPlayerFooter';
