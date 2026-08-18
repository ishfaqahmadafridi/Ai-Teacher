'use client';

import { memo } from 'react';
import { GraduationCap, BookOpen } from 'lucide-react';
import type { SettingsTabProps } from '../../types/settings.types';

export const AcademicPreferencesTab = memo(function AcademicPreferencesTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Academic Level */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Current Academic Level</h4>
            <p className="text-xs text-[#94A3B8]">
              Used to adapt course difficulty and problem set complexity.
            </p>
          </div>
        </div>

        <select
          value={settings.academicLevel}
          onChange={(e) => onChange('academicLevel', e.target.value)}
          className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
        >
          {['High School', 'Undergraduate', 'Postgraduate', 'Doctorate & Research'].map((level) => (
            <option key={level} value={level} className="bg-[#0F172A] text-white">
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Primary Field of Study */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Primary Discipline & Major</h4>
            <p className="text-xs text-[#94A3B8]">
              Your active field synchronized across AI Teacher recommendations.
            </p>
          </div>
        </div>

        <select
          value={settings.primaryField}
          onChange={(e) => onChange('primaryField', e.target.value)}
          className="w-full bg-[#070D1A] border border-[#1E293B] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#38BDF8] cursor-pointer"
        >
          {[
            'Computer Science & IT',
            'Medical & Healthcare',
            'Pure & Applied Sciences',
            'Humanities & Social Sciences',
            'Business & Design',
          ].map((field) => (
            <option key={field} value={field} className="bg-[#0F172A] text-white">
              {field}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
});

AcademicPreferencesTab.displayName = 'AcademicPreferencesTab';
