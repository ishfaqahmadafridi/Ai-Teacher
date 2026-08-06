'use client';

import { Button } from "@/components/ui/button";

interface ProfileFormActionsProps {
  onBack: () => void;
}

export function ProfileFormActions({ onBack }: ProfileFormActionsProps) {
  return (
    <div className="pt-6 flex flex-col md:flex-row gap-4">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        className="flex-1 h-12 order-2 md:order-1 bg-white/5 hover:bg-white/10 text-white font-semibold text-sm transition-all border-white/10 rounded-xl cursor-pointer"
      >
        Back
      </Button>
      <Button
        type="submit"
        className="flex-[2] h-12 order-1 md:order-2 bg-gradient-to-r from-[#0043eb] to-[#0035be] hover:from-[#003ad6] hover:to-[#002cb0] text-white font-semibold text-sm shadow-[0_0_20px_rgba(0,67,235,0.4)] hover:shadow-[0_0_35px_rgba(0,67,235,0.6)] transition-all rounded-xl cursor-pointer"
      >
        Save & Continue
      </Button>
    </div>
  );
}
