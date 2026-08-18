'use client';

import { memo } from 'react';
import { Target, Award, Clock } from 'lucide-react';
import type { SettingsTabProps } from '../../types/settings.types';

export const StudyGoalsSettingsTab = memo(function StudyGoalsSettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Target Daily Study Hours */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Daily Learning Hour Goal</h4>
            <p className="text-xs text-[#94A3B8]">
              Set your target daily study commitment to earn streak multipliers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { hours: 0.5, label: '30 Mins / Day' },
            { hours: 1, label: '1 Hour / Day' },
            { hours: 2, label: '2 Hours / Day (Rec)' },
            { hours: 4, label: '4 Hours / Day' },
          ].map((item) => {
            const isSelected = settings.dailyStudyGoalHours === item.hours;
            return (
              <button
                key={item.hours}
                type="button"
                onClick={() => onChange('dailyStudyGoalHours', item.hours)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white font-bold'
                    : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="text-xs">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Quiz Goal */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Weekly Practice & Quiz Target</h4>
            <p className="text-xs text-[#94A3B8]">
              Number of AI practice quizzes to complete each week.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { count: 2, label: '2 Quizzes / Wk' },
            { count: 5, label: '5 Quizzes / Wk' },
            { count: 10, label: '10 Quizzes / Wk' },
          ].map((item) => {
            const isSelected = settings.weeklyQuizGoal === item.count;
            return (
              <button
                key={item.count}
                type="button"
                onClick={() => onChange('weeklyQuizGoal', item.count)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8B5CF6]/20 border-[#C4B5FD] text-white font-bold'
                    : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="text-xs">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal Target Badge Info */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] flex items-center gap-3 text-xs text-[#38BDF8]">
        <Award className="w-5 h-5 shrink-0 text-[#38BDF8]" />
        <span>Completing your daily goals unlocks advanced AI Professor live mentoring sessions.</span>
      </div>
    </div>
  );
});

StudyGoalsSettingsTab.displayName = 'StudyGoalsSettingsTab';
