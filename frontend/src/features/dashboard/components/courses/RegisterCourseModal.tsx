'use client';

import { memo } from 'react';
import { DashboardDialog } from '../modals/DashboardDialog';
import { BookOpen, X, Sparkles } from 'lucide-react';
import { useRegisterCourseModal } from '../../hooks/useRegisterCourseModal';
import { CourseOutlineModal } from './CourseOutlineModal';
import { RegisterCourseForm } from './RegisterCourseForm';
import type { RegisterCourseModalProps } from '../../types/courses.types';

export const RegisterCourseModal = memo(function RegisterCourseModal(props: RegisterCourseModalProps) {
  const { isOpen, registeredCourse, handleClose, error, isPending, formData, handleChange, handleSubmit } = useRegisterCourseModal(props);

  if (!isOpen) return null;
  if (registeredCourse) return <CourseOutlineModal course={registeredCourse} onClose={handleClose} />;

  return (
    <DashboardDialog title="Register New Course" onClose={handleClose} className="max-w-[36rem] p-5 sm:p-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-6 border-b border-dashboard-border">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-dashboard-primary/20 border border-dashboard-primary/30 text-dashboard-primary">
              <BookOpen className="w-6 h-6 text-dashboard-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-dashboard-text tracking-tight">Register New Course</h2>
                <Sparkles className="w-4 h-4 text-dashboard-primary" />
              </div>
              <p className="text-xs text-dashboard-muted mt-0.5">
                Select your field name, enter course details, and register your course.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close Registration Modal"
            className="p-2 rounded-full text-dashboard-muted hover:text-dashboard-text hover:bg-dashboard-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <RegisterCourseForm
          error={error}
          isPending={isPending}
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={handleClose}
        />
    </DashboardDialog>
  );
});

RegisterCourseModal.displayName = 'RegisterCourseModal';
