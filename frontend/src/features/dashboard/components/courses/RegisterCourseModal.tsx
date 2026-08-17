'use client';

import { memo } from 'react';
import { BookOpen, X, Sparkles } from 'lucide-react';
import { useRegisterCourseModal } from '../../hooks/useRegisterCourseModal';
import { RegisterCourseForm } from './RegisterCourseForm';
import type { RegisterCourseModalProps } from '../../types/courses.types';

export const RegisterCourseModal = memo(function RegisterCourseModal(props: RegisterCourseModalProps) {
  const { isOpen, formData, handleChange, handleSubmit } = useRegisterCourseModal(props);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200 font-['Hanken_Grotesk',sans-serif]">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={props.onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-[#0F172A] border border-[#1E293B] rounded-3xl shadow-2xl z-10 p-6 sm:p-8 my-8">
        {/* Modal Header */}
        <div className="flex items-start justify-between pb-4 mb-6 border-b border-[#1E293B]">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#38BDF8]">
              <BookOpen className="w-6 h-6 text-[#38BDF8]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white tracking-tight">Register New Course</h2>
                <Sparkles className="w-4 h-4 text-[#38BDF8]" />
              </div>
              <p className="text-xs text-[#94A3B8] mt-0.5">
                Select your field name, enter course details, and enroll into physics curriculum.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={props.onClose}
            aria-label="Close Registration Modal"
            className="p-2 rounded-full text-[#94A3B8] hover:text-white hover:bg-[#1E293B] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <RegisterCourseForm
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClose={props.onClose}
        />
      </div>
    </div>
  );
});

RegisterCourseModal.displayName = 'RegisterCourseModal';
