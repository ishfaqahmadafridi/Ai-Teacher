'use client';

import { memo } from 'react';
import { Search, GraduationCap, PlusCircle } from 'lucide-react';
import { useRegisteredCoursesSection } from '../../hooks/useRegisteredCoursesSection';
import { DEFAULT_REGISTERED_COURSES } from '../../constants/dashboardContentConstants';
import { RegisteredCourseCard } from './RegisteredCourseCard';
import type { RegisteredCoursesSectionProps } from '../../types/courses.types';

export const RegisteredCoursesSection = memo(function RegisteredCoursesSection({
  courses = DEFAULT_REGISTERED_COURSES,
  fieldTitle = 'Computer Science & Information Technology (IT)',
  onJoinCourse,
  onOpenRegisterModal,
  className = '',
}: RegisteredCoursesSectionProps) {
  const { filterQuery, filteredCourses, handleFilterChange } = useRegisteredCoursesSection({ courses });

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header Banner */}
      <div className="bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] border border-[#1E293B] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-full bg-[#2563EB]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#2563EB]/20 text-[#38BDF8] text-xs font-bold uppercase tracking-wider mb-2.5 border border-[#2563EB]/30">
              <GraduationCap className="w-4 h-4 text-[#38BDF8]" />
              <span>Registered Field & Discipline</span>
            </div>
            {/* Field Name Title */}
            <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
              {fieldTitle}
            </h2>
            {/* Subtitle */}
            <p className="font-['Hanken_Grotesk',sans-serif] text-sm text-[#94A3B8] mt-2 leading-relaxed w-full">
              Access your enrolled subject courses, view credit hours, and track lesson completion metrics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {/* Register New Course Action Button */}
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#2563eb]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 border border-[#38BDF8]/30"
            >
              <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
              <span>Register New Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Courses Search Filter Bar */}
      <div className="relative w-full max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
        <input
          type="text"
          placeholder="Filter your enrolled courses by name, code or field..."
          value={filterQuery}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-[#0B132B]/80 border border-[#1E293B] rounded-2xl text-xs text-white placeholder-[#64748B] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-all"
        />
      </div>

      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map((course) => (
          <RegisteredCourseCard
            key={course.id}
            course={course}
            onJoinCourse={onJoinCourse}
          />
        ))}
      </div>
    </div>
  );
});

RegisteredCoursesSection.displayName = 'RegisteredCoursesSection';
