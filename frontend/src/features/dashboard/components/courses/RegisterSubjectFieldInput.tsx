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
        <option value="Computer Science (CS)">Computer Science (CS)</option>
        <option value="Information Technology (IT)">Information Technology (IT)</option>
        <option value="Artificial Intelligence (AI)">Artificial Intelligence (AI)</option>
        <option value="Software Engineering (SE)">Software Engineering (SE)</option>
        <option value="Data Science & Analytics">Data Science & Analytics</option>
        <option value="Cyber Security & Networking">Cyber Security & Networking</option>
        <option value="Business & FinTech">Business & FinTech</option>
        <option value="Biomedical & Medical Sciences">Biomedical & Medical Sciences</option>
      </select>
    </div>
  );
});

RegisterSubjectFieldInput.displayName = 'RegisterSubjectFieldInput';
