'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import type { FullNameInputProps } from '../../types';

function FullNameInputComponent({ value, onChange }: FullNameInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Full Name <span className="text-red-400">*</span>
      </Label>
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. Alex Mercer"
          required
          className="h-12 bg-black/30 border border-white/15 rounded-xl pl-10 text-white placeholder:text-[#94A3B8] focus-visible:ring-[#b8c3ff]/30 text-sm font-medium"
        />
        <User className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

export const FullNameInput = memo(FullNameInputComponent);
FullNameInput.displayName = 'FullNameInput';
