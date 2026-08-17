'use client';

import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
import type { MobileSummaryBarProps } from '../../types';

function MobileSummaryBarComponent({ selectedCount, onSubmit }: MobileSummaryBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-[#070D1A]/95 border-t border-[#1E293B] backdrop-blur-2xl z-40 font-['Hanken_Grotesk',sans-serif]">
      <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
        <div className="space-y-0.5">
          <span className="text-xs text-[#94A3B8] font-semibold block">
            Selected Fields
          </span>
          <span className="text-sm font-extrabold text-white font-['JetBrains_Mono',monospace]">
            {selectedCount} Topics Chosen
          </span>
        </div>

        <Button
          type="button"
          onClick={onSubmit}
          disabled={selectedCount === 0}
          className="h-12 px-6 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#004AC6] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#2563eb]/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Launch Roadmap</span>
        </Button>
      </div>
    </div>
  );
}

export const MobileSummaryBar = memo(MobileSummaryBarComponent);
MobileSummaryBar.displayName = 'MobileSummaryBar';
