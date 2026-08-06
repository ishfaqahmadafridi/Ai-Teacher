'use client';

import { memo } from 'react';
import { Award, Zap, Brain, UserCheck, Sparkles, FileCheck, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { ProgressAnalyticsCardProps } from '../../types/dashboard.types';

export const ProgressAnalyticsCard = memo(function ProgressAnalyticsCard({
  weeklyProgressPercent = 75,
  streakDays = 7,
  attendancePercent = 96,
  classesAttended = 28,
  totalClasses = 29,
  classBehaviorScore = 95,
  aiFocusScore = 98,
  conceptMasteryScore = 88,
  assignmentsCompleted = 14,
  totalAssignments = 15,
  quizzesPassed = 8,
  totalQuizzes = 10,
  className = '',
}: ProgressAnalyticsCardProps) {
  return (
    <div
      className={`bg-[#0F172A]/90 backdrop-blur-md rounded-20 p-6 shadow-xl border border-[#1E293B] font-['Hanken_Grotesk',sans-serif] space-y-6 ${className}`}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg font-bold text-white">
          Overall Performance
        </h3>
        <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#10B981] bg-[#10B981]/20 border border-[#10B981]/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          Top 5% Student
        </span>
      </div>

      {/* Circular Progress Gauge */}
      <div className="relative flex flex-col items-center justify-center my-2">
        <svg className="w-44 h-44 -rotate-90 transform" viewBox="0 0 36 36">
          <path
            className="text-[#1E293B]"
            strokeWidth="3.5"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className="text-[#38BDF8] transition-all duration-1000 ease-out"
            strokeDasharray={`${weeklyProgressPercent}, 100`}
            strokeWidth="3.5"
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-['Hanken_Grotesk',sans-serif] text-3xl font-extrabold text-white">
            {weeklyProgressPercent}%
          </span>
          <span className="font-['JetBrains_Mono',monospace] text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
            Completed
          </span>
        </div>
      </div>

      {/* Attendance Highlight Bar */}
      <div className="bg-[#0B132B]/80 rounded-xl p-4 border border-[#1E293B]">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-[#10B981]" aria-hidden="true" />
            <span className="font-['JetBrains_Mono',monospace] text-xs font-semibold text-white uppercase tracking-wider">
              Attendance Rate
            </span>
          </div>
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-[#10B981]">
            {attendancePercent}% ({classesAttended}/{totalClasses} Classes)
          </span>
        </div>
        <div className="w-full bg-[#1E293B] rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#10B981] h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${attendancePercent}%` }}
            role="progressbar"
            aria-valuenow={attendancePercent}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      {/* Comprehensive Academic Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* Assignments */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center gap-3 border border-[#1E293B]">
          <div className="w-9 h-9 rounded-lg bg-[#2563eb]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
            <FileCheck className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] uppercase block truncate">
              Assignments
            </span>
            <span className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate">
              {assignmentsCompleted}/{totalAssignments} Done
            </span>
          </div>
        </div>

        {/* Quizzes */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center gap-3 border border-[#1E293B]">
          <div className="w-9 h-9 rounded-lg bg-[#712ae2]/20 text-[#a855f7] flex items-center justify-center shrink-0">
            <HelpCircle className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] uppercase block truncate">
              Quizzes
            </span>
            <span className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate">
              {quizzesPassed}/{totalQuizzes} Passed
            </span>
          </div>
        </div>

        {/* AI Focus Level */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center gap-3 border border-[#1E293B]">
          <div className="w-9 h-9 rounded-lg bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center shrink-0">
            <Zap className="w-4.5 h-4.5 fill-current" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] uppercase block truncate">
              AI Focus State
            </span>
            <span className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate">
              {aiFocusScore}% Deep Flow
            </span>
          </div>
        </div>

        {/* Concept Mastery */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center gap-3 border border-[#1E293B]">
          <div className="w-9 h-9 rounded-lg bg-[#004ac6]/20 text-[#38BDF8] flex items-center justify-center shrink-0">
            <Brain className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] uppercase block truncate">
              Concept Mastery
            </span>
            <span className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate">
              {conceptMasteryScore}% Advanced
            </span>
          </div>
        </div>

        {/* Class Behavior & Voice Response */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center gap-3 border border-[#1E293B]">
          <div className="w-9 h-9 rounded-lg bg-[#712ae2]/20 text-[#a855f7] flex items-center justify-center shrink-0">
            <Sparkles className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] uppercase block truncate">
              Class Behavior
            </span>
            <span className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate">
              {classBehaviorScore}% Active
            </span>
          </div>
        </div>

        {/* Avg Score */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center gap-3 border border-[#1E293B]">
          <div className="w-9 h-9 rounded-lg bg-[#10B981]/20 text-[#10B981] flex items-center justify-center shrink-0">
            <Award className="w-4.5 h-4.5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <span className="font-['JetBrains_Mono',monospace] text-[10px] text-[#94A3B8] uppercase block truncate">
              Avg Score
            </span>
            <span className="font-['Hanken_Grotesk',sans-serif] text-sm font-bold text-white truncate">
              92%
            </span>
          </div>
        </div>

        {/* Streak Footer */}
        <div className="bg-[#0B132B]/80 rounded-xl p-3 flex items-center justify-center gap-2 col-span-2 py-2.5 border border-[#1E293B]">
          <CheckCircle2 className="w-4 h-4 text-[#F59E0B]" aria-hidden="true" />
          <span className="font-['JetBrains_Mono',monospace] text-xs font-bold text-white">
            Current Learning Streak: {streakDays} Days Active 🔥
          </span>
        </div>
      </div>
    </div>
  );
});

ProgressAnalyticsCard.displayName = 'ProgressAnalyticsCard';
