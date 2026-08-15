'use client';

import { memo } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar } from 'lucide-react';
import type { DobInputProps } from '../../types';

function DobInputComponent({ value, onChange }: DobInputProps) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-semibold uppercase tracking-wider text-[#c6c6cc]">
        Date of Birth
      </Label>
      <div className="relative">
        <Input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 bg-black/30 border border-white/15 rounded-xl pl-10 text-white focus-visible:ring-[#b8c3ff]/30 text-sm font-medium [color-scheme:dark]"
        />
        <Calendar className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}

export const DobInput = memo(DobInputComponent);
DobInput.displayName = 'DobInput';
