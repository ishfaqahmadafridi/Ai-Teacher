'use client';

import { Label } from "@/components/ui/label";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function CountrySelect({ value, onChange }: CountrySelectProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Country
      </Label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#b8c3ff] transition-all text-sm appearance-none cursor-pointer pr-10"
        >
          <option value="" disabled>Select your country</option>
          <option value="US">🇺🇸 United States</option>
          <option value="UK">🇬🇧 United Kingdom</option>
          <option value="CA">🇨🇦 Canada</option>
          <option value="DE">🇩🇪 Germany</option>
          <option value="JP">🇯🇵 Japan</option>
          <option value="AU">🇦🇺 Australia</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#c6c6cc]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
}
