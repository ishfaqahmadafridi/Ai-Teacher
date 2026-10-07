'use client';

import { Button } from '@/components/ui/button';
import { useOnboarding } from '../hooks/useOnboarding';

export function SkipStepButton({ step }: { step: number }) {
  const { skipStep, isLoading } = useOnboarding();

  return (
    <Button
      type="button"
      variant="ghost"
      disabled={isLoading}
      onClick={() => void skipStep(step)}
      className="h-12 px-6 rounded-xl border border-slate-500 bg-slate-900/60 text-slate-300 hover:border-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
    >
      Skip for now
    </Button>
  );
}
