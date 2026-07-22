'use client';

import { Button } from '@/components/ui/button';

interface MobileSummaryBarProps {
  selectedCount: number;
  onSubmit: () => void;
}

export function MobileSummaryBar({ selectedCount, onSubmit }: MobileSummaryBarProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1c1b1d]/95 border-t border-white/15 p-4 backdrop-blur-2xl flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-6 h-6 rounded-full bg-[#0043eb] text-white flex items-center justify-center text-xs font-bold">
          {selectedCount}
        </span>
        <span className="text-sm font-semibold text-white">Selected</span>
      </div>
      <Button
        type="button"
        onClick={onSubmit}
        disabled={selectedCount === 0}
        className="px-6 h-10 rounded-xl bg-gradient-to-r from-[#0043eb] to-[#00d2ff] text-white text-xs font-bold shadow-lg disabled:opacity-40"
      >
        Begin Journey
      </Button>
    </div>
  );
}
