'use client';

import { memo } from 'react';
import { Tag } from 'lucide-react';
import type { RegisterSubjectFieldInputProps } from '../../types/courses.types';

export const RegisterSubjectFieldInput = memo(function RegisterSubjectFieldInput({
  subjectField,
  onChange,
  className = '',
}: RegisterSubjectFieldInputProps) {
  return (
    <div className={className}>
      <label
        htmlFor="reg-subject-field"
        className="block text-xs font-semibold text-[#94A3B8] uppercase tracking-wider mb-1.5 flex items-center gap-1.5"
      >
        <Tag className="w-3.5 h-3.5 text-[#38BDF8]" /> Subject / Field Name
      </label>
      <select
        id="reg-subject-field"
        name="subjectField"
        value={subjectField}
        onChange={onChange}
        className="w-full bg-[#1E293B] border border-[#334155] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] transition-colors cursor-pointer"
      >
        <option value="Computer Science & IT">Computer Science & IT</option>
        <option value="Physics & Engineering">Physics & Engineering</option>
        <option value="Astrophysics">Astrophysics</option>
        <option value="Classical Field Theory">Classical Field Theory</option>
        <option value="Quantum Mechanics">Quantum Mechanics</option>
        <option value="Mathematics & Calculus">Mathematics & Calculus</option>
      </select>
    </div>
  );
});

RegisterSubjectFieldInput.displayName = 'RegisterSubjectFieldInput';
