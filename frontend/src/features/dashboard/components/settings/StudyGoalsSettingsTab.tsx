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
      <div className="p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
            <Clock aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text">Daily Learning Hour Goal</h4>
            <p className="text-xs text-dashboard-muted">
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
                aria-pressed={isSelected}
                onClick={() => onChange('dailyStudyGoalHours', item.hours)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-dashboard-selected border-dashboard-primary/50 text-dashboard-text font-semibold'
                    : 'bg-dashboard-panel border-dashboard-border text-dashboard-muted hover:text-dashboard-text'
                }`}
              >
                <div className="text-xs">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weekly Quiz Goal */}
      <div className="p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dashboard-subtle border border-dashboard-border flex items-center justify-center text-dashboard-muted shrink-0">
            <Target aria-hidden="true" strokeWidth={1.75} className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-dashboard-text">Weekly Practice & Quiz Target</h4>
            <p className="text-xs text-dashboard-muted">
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
                aria-pressed={isSelected}
                onClick={() => onChange('weeklyQuizGoal', item.count)}
                className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-dashboard-selected border-dashboard-primary/50 text-dashboard-text font-semibold'
                    : 'bg-dashboard-panel border-dashboard-border text-dashboard-muted hover:text-dashboard-text'
                }`}
              >
                <div className="text-xs">{item.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal Target Badge Info */}
      <div className="p-4 rounded-2xl bg-dashboard-panel border border-dashboard-border flex items-center gap-3 text-xs text-dashboard-primary">
        <Award aria-hidden="true" strokeWidth={1.75} className="w-5 h-5 shrink-0 text-dashboard-primary" />
        <span>Completing your daily goals unlocks advanced AI Professor live mentoring sessions.</span>
      </div>
    </div>
  );
});

StudyGoalsSettingsTab.displayName = 'StudyGoalsSettingsTab';
