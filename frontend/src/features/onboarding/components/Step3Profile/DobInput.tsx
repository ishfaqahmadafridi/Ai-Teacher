'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DobInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function DobInput({ value, onChange }: DobInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Date of Birth
      </Label>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 bg-black/20 border-white/10 text-white focus-visible:border-[#b8c3ff] focus-visible:ring-0 text-sm rounded-xl px-4"
      />
    </div>
  );
}
