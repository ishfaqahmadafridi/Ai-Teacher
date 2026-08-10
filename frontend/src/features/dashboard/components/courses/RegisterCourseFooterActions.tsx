'use client';

import { memo } from 'react';
import { PlusCircle } from 'lucide-react';
import type { RegisterCourseFooterActionsProps } from '../../types/courses.types';

export const RegisterCourseFooterActions = memo(function RegisterCourseFooterActions({
  onClose,
  className = '',
}: RegisterCourseFooterActionsProps) {
  return (
    <div className={`pt-4 border-t border-[#1E293B] flex items-center justify-end gap-3 mt-6 ${className}`}>
      <button
        type="button"
        onClick={onClose}
        className="px-5 py-2.5 rounded-xl border border-[#334155] text-[#94A3B8] hover:text-white hover:bg-[#1E293B] text-sm font-semibold transition-all cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#1E40AF] text-white text-sm font-semibold shadow-lg shadow-[#2563eb]/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
      >
        <PlusCircle className="w-4 h-4 text-[#38BDF8]" />
        <span>Register Course Now</span>
      </button>
    </div>
  );
});

RegisterCourseFooterActions.displayName = 'RegisterCourseFooterActions';
