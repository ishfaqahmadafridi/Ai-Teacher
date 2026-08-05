'use client';

import { useState, useMemo } from 'react';
import { MOCK_STUDENTS, DEFAULT_ATTENDANCE_SUMMARY } from '../constants/sidebarConstants';

export function useStudentsModal() {
  const [filter, setFilter] = useState<'all' | 'present' | 'absent'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const stats = useMemo(() => {
    return DEFAULT_ATTENDANCE_SUMMARY;
  }, []);

  const filteredStudents = useMemo(() => {
    return MOCK_STUDENTS.filter((student) => {
      const matchesFilter = filter === 'all' || student.status === filter;
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    filteredStudents,
  };
}
