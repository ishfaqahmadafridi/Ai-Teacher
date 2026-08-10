'use client';

import { memo } from 'react';
import { Code, Award } from 'lucide-react';
import type { RegisterCourseCodeHoursInputsProps } from '../../types/courses.types';

export const RegisterCourseCodeHoursInputs = memo(function RegisterCourseCodeHoursInputs({
  courseCode,
  creditHours,
  onChange,
  className = '',
}: RegisterCourseCodeHoursInputsProps) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 ${className}`}>
      <div>
        <label
          htmlFor="reg-course-code"
          className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <Code className="w-3.5 h-3.5 text-[#38BDF8]" /> Course Code
        </label>
        <input
          id="reg-course-code"
          type="text"
          name="courseCode"
          value={courseCode}
          onChange={onChange}
          placeholder="CS-301"
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors uppercase font-mono"
        />
      </div>
      <div>
        <label
          htmlFor="reg-credit-hours"
          className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
        >
          <Award className="w-3.5 h-3.5 text-[#38BDF8]" /> Credit Hours
        </label>
        <input
          id="reg-credit-hours"
          type="number"
          name="creditHours"
          min={1}
          max={6}
          value={creditHours}
          onChange={onChange}
          className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors"
        />
      </div>
    </div>
  );
});

RegisterCourseCodeHoursInputs.displayName = 'RegisterCourseCodeHoursInputs';
