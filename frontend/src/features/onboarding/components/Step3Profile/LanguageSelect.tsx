'use client';

import { Label } from "@/components/ui/label";

interface LanguageSelectProps {
  value?: string;
  onChange: (value: string) => void;
}

export function LanguageSelect({ value = 'English (US)', onChange }: LanguageSelectProps) {
  return (
    <div className="space-y-2 md:col-span-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Preferred Language
      </Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b8c3ff] transition-all text-sm appearance-none cursor-pointer pr-10"
        >
          <option value="English (US)">English (US)</option>
          <option value="Español">Español</option>
          <option value="Français">Français</option>
          <option value="Deutsch">Deutsch</option>
          <option value="中文">中文</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#c6c6cc]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
