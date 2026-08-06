'use client';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FullNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function FullNameInput({ value, onChange }: FullNameInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Full Name
      </Label>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="John Doe"
        className="h-12 bg-black/20 border-white/10 text-white placeholder:text-white/30 focus-visible:border-[#b8c3ff] focus-visible:ring-0 text-sm rounded-xl px-4"
      />
    </div>
  );
}
