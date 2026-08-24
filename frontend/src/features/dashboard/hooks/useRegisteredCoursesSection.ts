'use client';

import { useState, useMemo, useCallback } from 'react';
import type { RegisteredCourseItem } from '../types/courses.types';

export interface UseRegisteredCoursesSectionOptions {
  courses?: RegisteredCourseItem[];
}

export function useRegisteredCoursesSection({
  courses = [],
}: UseRegisteredCoursesSectionOptions = {}) {
  const [filterQuery, setFilterQuery] = useState('');

  const handleFilterChange = useCallback((val: string) => {
    setFilterQuery(val);
  }, []);

  const filteredCourses = useMemo(() => {
    if (!filterQuery.trim()) return courses;
    const q = filterQuery.toLowerCase();
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.subjectField.toLowerCase().includes(q) ||
        c.courseCode.toLowerCase().includes(q)
    );
  }, [courses, filterQuery]);

  return {
    filterQuery,
    filteredCourses,
    handleFilterChange,
  };
}
