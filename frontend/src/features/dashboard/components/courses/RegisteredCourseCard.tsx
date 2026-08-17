'use client';

import { memo } from 'react';
import { Award, Calendar, BookOpen } from 'lucide-react';
import type { RegisteredCourseCardProps } from '../../types/courses.types';

export const RegisteredCourseCard = memo(function RegisteredCourseCard({
  course,
  className = '',
}: RegisteredCourseCardProps) {
  return (
    <div
      className={`bg-[#0F172A] border border-[#1E293B] hover:border-[#38BDF8]/40 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-[#38BDF8]/5 flex flex-col md:flex-row md:items-center justify-between gap-6 group ${className}`}
    >
      {/* Left Details Column */}
      <div className="flex-1 min-w-0">
        {/* Top Badges: Subject Field & Course Code */}
        <div className="flex items-center gap-3 mb-2.5">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30 tracking-wide uppercase">
            {course.subjectField}
          </span>
          <span className="text-xs font-mono font-medium text-[#94A3B8] bg-[#1E293B] px-2.5 py-0.5 rounded-md border border-[#334155]">
            {course.courseCode}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-[#38BDF8] transition-colors leading-snug">
          {course.title}
        </h3>

        {/* Credit Hours & Enrollment Info */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-[#38BDF8]">
            <Award className="w-4 h-4 text-[#38BDF8]" />
            <span>{course.creditHours} Credit Hours</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8]">
            <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>Enrolled: {course.enrolledDate}</span>
          </div>
        </div>
      </div>

      {/* Right Column: Progress Bar & Metrics (No Open Classroom button) */}
      <div className="w-full md:w-72 shrink-0 space-y-2 pt-3 md:pt-0 border-t md:border-t-0 border-[#1E293B]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#94A3B8] font-medium">Course Completion</span>
          <span className="text-[#38BDF8] font-mono font-bold">{course.progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 rounded-full bg-[#1E293B] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] transition-all duration-500"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
          <span className="flex items-center gap-1 text-[#38BDF8]">
            <BookOpen className="w-3 h-3" /> Active Course
          </span>
          <span>{course.completedLessons} of {course.totalLessons} Lessons</span>
        </div>
      </div>
    </div>
  );
});

RegisteredCourseCard.displayName = 'RegisteredCourseCard';
