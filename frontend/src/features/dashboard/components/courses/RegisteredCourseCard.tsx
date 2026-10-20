'use client';

import { memo } from 'react';
import { CircleCheck, Clock3, Layers3, CalendarDays } from 'lucide-react';
import type { RegisteredCourseCardProps } from '../../types/courses.types';

export const RegisteredCourseCard = memo(function RegisteredCourseCard({
  course,
  className = '',
}: RegisteredCourseCardProps) {
  const StatusIcon = course.status === 'upcoming' ? Clock3 : CircleCheck;

  return (
    <div
      className={`bg-dashboard-panel border border-dashboard-border hover:border-dashboard-primary/40 rounded-3xl p-6 transition-all duration-300 shadow-none hover:shadow-none/10 flex flex-col justify-between gap-5 group relative overflow-hidden ${className}`}
    >
      {/* Top Header: Subject Field Badge & Course Code */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-dashboard-primary/20 text-dashboard-primary border border-dashboard-primary/30 tracking-wide uppercase">
          {course.subjectField}
        </span>
        <span className="text-[11px] font-mono font-semibold text-dashboard-muted bg-dashboard-subtle px-2.5 py-1 rounded-lg border border-dashboard-border">
          {course.courseCode}
        </span>
      </div>

      {/* Course Title */}
      <div className="my-1">
        <h3 className="font-['Hanken_Grotesk',sans-serif] text-base sm:text-lg font-bold text-dashboard-text group-hover:text-dashboard-primary transition-colors leading-snug">
          {course.title}
        </h3>
      </div>

      {/* Course Completion & Progress Bar */}
      <div className="space-y-2.5 pt-3 border-t border-dashboard-border">
        <div className="flex items-center justify-between text-xs">
          <span className="text-dashboard-muted font-medium">Course Completion</span>
          <span className="text-dashboard-primary font-mono font-bold">{course.progressPercent}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-dashboard-subtle overflow-hidden">
          <div
            className="h-full rounded-full bg-dashboard-primary transition-all duration-500"
            style={{ width: `${course.progressPercent}%` }}
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 text-xs text-dashboard-muted">
          <span className="inline-flex items-center gap-1.5 font-medium text-dashboard-text">
            <StatusIcon className="h-3.5 w-3.5 text-dashboard-muted" strokeWidth={1.75} aria-hidden="true" />
            {course.status === 'completed' ? 'Completed' : course.status === 'upcoming' ? 'Upcoming' : 'Active course'}
          </span>
          <span>{course.totalLessons > 0 ? `${course.completedLessons} of ${course.totalLessons} Lessons` : 'No lessons recorded'}</span>
        </div>
      </div>

      {/* Bottom Row: Credit Hours & Enrollment Info */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 pt-3 border-t border-dashboard-border text-xs">
        <div className="flex items-center gap-1.5 font-medium text-dashboard-muted">
          <Layers3 className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>{course.creditHours} {course.creditHours === 1 ? 'credit hour' : 'credit hours'}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-dashboard-muted">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
          <span>{course.enrolledDate ? `Enrolled ${course.enrolledDate}` : 'Enrollment date unavailable'}</span>
        </div>
      </div>
    </div>
  );
});

RegisteredCourseCard.displayName = 'RegisteredCourseCard';
