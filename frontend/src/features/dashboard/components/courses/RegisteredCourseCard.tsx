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
      className={`bg-[#0F172A] border border-[#1E293B] hover:border-[#38BDF8]/40 rounded-3xl p-6 transition-all duration-300 shadow-xl hover:shadow-[#38BDF8]/10 flex flex-col justify-between gap-5 group relative overflow-hidden ${className}`}
    >
      {/* Top Header: Subject Field Badge & Course Code */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-[#2563EB]/20 text-[#38BDF8] border border-[#2563EB]/30 tracking-wide uppercase">
          {course.subjectField}
        </span>
        <span className="text-[11px] font-mono font-semibold text-[#94A3B8] bg-[#1E293B] px-2.5 py-1 rounded-lg border border-[#334155]">
          {course.courseCode}
        </span>
      </div>

      {/* Course Title */}
      <div className="my-1">
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-base sm:text-lg font-bold text-white group-hover:text-[#38BDF8] transition-colors leading-snug">
          {course.title}
        </h3>
      </div>

      {/* Course Completion & Progress Bar */}
      <div className="space-y-2.5 pt-3 border-t border-[#1E293B]">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#94A3B8] font-medium">Course Completion</span>
          <span className="text-[#38BDF8] font-mono font-bold">{course.progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-[#1E293B] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] transition-all duration-500"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8] font-mono">
          <span className="flex items-center gap-1 text-[#38BDF8] font-semibold">
            <BookOpen className="w-3.5 h-3.5" /> Active Course
          </span>
          <span>{course.completedLessons} of {course.totalLessons} Lessons</span>
        </div>
      </div>

      {/* Bottom Row: Credit Hours & Enrollment Info */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1E293B] text-xs">
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
  );
});

RegisteredCourseCard.displayName = 'RegisteredCourseCard';
