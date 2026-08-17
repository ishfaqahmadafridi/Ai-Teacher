'use client';

import { memo } from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { QuizQuestionStepProps } from '../../types/assignments.types';

export const QuizQuestionStep = memo(function QuizQuestionStep({
  currentQuestionIndex,
  totalQuestions,
  currentQuestion,
  selectedAnswers,
  onSelectOption,
  className = '',
}: QuizQuestionStepProps) {
  if (!currentQuestion) return null;

  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Question Counter Header */}
      <div className="flex items-center justify-between text-xs text-[#94A3B8]">
        <span>
          Question <strong className="text-white">{currentQuestionIndex + 1}</strong> of{' '}
          <strong className="text-white">{totalQuestions}</strong>
        </span>
        <span className="font-mono text-[#F59E0B] font-bold">
          {currentQuestion.points} Points
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#1E293B] h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD] h-full rounded-full transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Question Text & Options */}
      <div className="space-y-4">
        <h4 className="font-['Hanken_Grotesk',sans-serif] text-base font-bold text-white leading-relaxed">
          {currentQuestion.questionText}
        </h4>

        {/* Multiple Choice Options */}
        <div className="space-y-2.5">
          {currentQuestion.options.map((opt) => {
            const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSelectOption(opt.id)}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-lg'
                    : 'bg-[#090D16] border-[#1E293B] text-[#94A3B8] hover:border-[#334155] hover:text-white'
                }`}
              >
                <span className="text-xs font-semibold">{opt.text}</span>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    isSelected
                      ? 'border-[#8B5CF6] bg-[#8B5CF6] text-white'
                      : 'border-[#334155]'
                  }`}
                >
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

QuizQuestionStep.displayName = 'QuizQuestionStep';
