'use client';

import { memo } from 'react';
import { Search, GraduationCap, PlusCircle } from 'lucide-react';
import { useRegisteredCoursesSection } from '../../hooks/useRegisteredCoursesSection';
import { RegisteredCourseCard } from './RegisteredCourseCard';
import type { RegisteredCoursesSectionProps } from '../../types/courses.types';
import { useAuthStore } from '@/features/auth/state/authStore';

export const RegisteredCoursesSection = memo(function RegisteredCoursesSection({
  courses = [],
  fieldTitle = 'Your registered courses',
  onJoinCourse,
  onOpenRegisterModal,
  className = '',
}: RegisteredCoursesSectionProps) {
  const { filterQuery, filteredCourses, handleFilterChange } = useRegisteredCoursesSection({ courses });
  const interests = useAuthStore((state) => state.user?.selectedInterests);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Section Header Banner */}
      <div className="bg-dashboard-panel border border-dashboard-border rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-none">
        <div className="absolute right-0 top-0 w-80 h-full bg-dashboard-primary/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dashboard-primary/20 text-dashboard-primary text-xs font-bold uppercase tracking-wider mb-2.5 border border-dashboard-primary/30">
              <GraduationCap className="w-4 h-4 text-dashboard-primary" />
              <span>Registered Field & Discipline</span>
            </div>
            {/* Field Name Title */}
            <h2 className="font-['Hanken_Grotesk',sans-serif] text-2xl sm:text-3xl font-black text-dashboard-text tracking-tight leading-tight">
              {fieldTitle}
            </h2>
            {/* Subtitle */}
            <p className="font-['Hanken_Grotesk',sans-serif] text-sm text-dashboard-muted mt-2 leading-relaxed w-full">
              Access your enrolled subject courses, view credit hours, and track lesson completion metrics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto shrink-0">
            {/* Register New Course Action Button */}
            <button
              type="button"
              onClick={onOpenRegisterModal}
              className="dashboard-button dashboard-button-primary w-full sm:w-auto"
            >
              <PlusCircle className="w-4 h-4" aria-hidden="true" />
              <span>Register New Course</span>
            </button>
          </div>
        </div>
      </div>

      {/* Courses Search Filter Bar */}
      <div className="relative w-full max-w-[32rem]">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dashboard-muted pointer-events-none" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search registered courses"
          placeholder="Search courses by name, code, or field"
          value={filterQuery}
          onChange={(e) => handleFilterChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-dashboard-panel/80 border border-dashboard-border rounded-lg text-sm text-dashboard-text placeholder-dashboard-muted focus:outline-none focus:border-dashboard-primary focus:ring-1 focus:ring-dashboard-primary transition-all"
        />
      </div>

      {filteredCourses.length === 0 && (
        <div className="space-y-3 text-dashboard-muted">
          <p>{courses.length === 0 ? 'You have not registered any courses yet.' : 'No courses match your search.'}</p>
          {courses.length === 0 && (
            <>
              {interests && interests.length > 0 && <p>Saved learning interests: {interests.join(', ')}.</p>}
              <p>Learning interests are saved in your profile. To enroll, click Register New Course, choose an interest, enter the course details, and submit the registration form.</p>
            </>
          )}
        </div>
      )}
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
