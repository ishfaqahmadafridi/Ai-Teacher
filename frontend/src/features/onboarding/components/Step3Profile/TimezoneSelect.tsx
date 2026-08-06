'use client';

import { Label } from "@/components/ui/label";

interface TimezoneSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimezoneSelect({ value, onChange }: TimezoneSelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Time Zone
      </Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b8c3ff] transition-all text-sm appearance-none cursor-pointer pr-10"
        >
          <option value="" disabled>Select time zone</option>
          <option value="UTC-8">PST (UTC-8)</option>
          <option value="UTC-5">EST (UTC-5)</option>
          <option value="UTC+0">GMT (UTC+0)</option>
          <option value="UTC+1">CET (UTC+1)</option>
          <option value="UTC+9">JST (UTC+9)</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#c6c6cc]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" strokeWidth="2" />
            <path strokeLinecap="round" strokeWidth="2" d="M12 6v6l4 2" />
          </svg>
        </div>
      </div>
    </div>
  );
}
