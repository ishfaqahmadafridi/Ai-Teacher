'use client';

import { Tag, BookOpen } from 'lucide-react';
import type { ScheduleSlotFieldsProps } from '../../types/schedule.types';

export function ScheduleTopicFields({ model }: ScheduleSlotFieldsProps) {
  const { title, setTitle, subject, setSubject, subjectOptions } = model;
  return (
    <>
            {/* 1. Class Topic / Title */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-blue-400" />
                Session Topic / Class Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Mechanics & Wave Dynamics"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
                required
              />
            </div>

            {/* 2. Course / Subject */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 uppercase tracking-wider">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                Course / Subject
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-white text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all"
              >
                <option value="">Choose a registered course</option>
                {subjectOptions.map((subj) => (
                  <option key={subj} value={subj} className="bg-slate-900 text-white">
                    {subj}
                  </option>
                ))}
              </select>
            </div>

    </>
  );
}
