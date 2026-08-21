'use client';

import { memo } from 'react';
import { useStudentsModal } from '../../../hooks/useStudentsModal';
import { StudentsModalHeader } from './StudentsModalHeader';
import { StudentsModalStatsBar } from './StudentsModalStatsBar';
import { StudentsModalFilterBar } from './StudentsModalFilterBar';
import { StudentRosterRow } from './StudentRosterRow';
import type { StudentsModalProps } from '../../../types/sidebar.types';

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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-[#1a1c22] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <StudentsModalHeader onClose={onClose} />

        {/* Stats Summary Bar */}
        <StudentsModalStatsBar
          total={stats.total}
          present={stats.present}
          absent={stats.absent}
        />

        {/* Search & Filter Bar */}
        <StudentsModalFilterBar
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalCount={stats.total}
          presentCount={stats.present}
          absentCount={stats.absent}
        />

        {/* Student List (Scrollable) */}
        <div className="p-4 md:p-6 overflow-y-auto space-y-2.5 flex-1 max-h-[400px]">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <StudentRosterRow key={student.id} student={student} />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="font-['Hanken_Grotesk',sans-serif] text-sm text-[#c4c5d9]">
                No students found matching your criteria.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

StudentsModal.displayName = 'StudentsModal';
