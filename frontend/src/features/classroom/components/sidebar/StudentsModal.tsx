'use client';

import { memo } from 'react';
import { useStudentsModal } from '../../hooks/useStudentsModal';
import { StudentsModalHeader } from './StudentsModalHeader';
import { StudentsModalStatsBar } from './StudentsModalStatsBar';
import { StudentsModalFilterBar } from './StudentsModalFilterBar';
import { StudentRosterRow } from './StudentRosterRow';
import type { StudentsModalProps } from '../../types/sidebar.types';

export const StudentsModal = memo(function StudentsModal({
  isOpen,
  onClose,
}: StudentsModalProps) {
  const {
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    stats,
    filteredStudents,
  } = useStudentsModal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-[#1a1c20] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10 font-['Hanken_Grotesk',sans-serif] max-h-[85vh]">
        {/* Modal Header Sub-component */}
        <StudentsModalHeader onClose={onClose} />

        {/* Stats Summary Bar Sub-component */}
        <StudentsModalStatsBar
          total={stats.total}
          present={stats.present}
          absent={stats.absent}
        />

        {/* Filter & Search Bar Sub-component */}
        <StudentsModalFilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={stats.total}
          presentCount={stats.present}
          absentCount={stats.absent}
        />

        {/* Student Roster List */}
        <div className="flex-1 p-4 md:p-5 overflow-y-auto space-y-2 max-h-[360px]">
          {filteredStudents.map((student) => (
            <StudentRosterRow key={student.id} student={student} />
          ))}
        </div>
      </div>
    </div>
  );
});

StudentsModal.displayName = 'StudentsModal';
