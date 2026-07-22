'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface LearningSummarySidebarProps {
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
  onSubmit: () => void;
}

export function LearningSummarySidebar({
  selectedInterests,
  onToggleInterest,
  onSubmit,
}: LearningSummarySidebarProps) {
  const selectedCount = selectedInterests.length;
  const strengthPercent = Math.min(selectedCount * 25, 100);

  return (
    <aside className="hidden md:block w-80 shrink-0 sticky top-8">
      <Card className="bg-white/5 border-white/10 backdrop-blur-2xl rounded-3xl p-6 space-y-6 shadow-2xl">
        <div className="space-y-1">
          <h4 className="text-xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Learning Summary
          </h4>
          <p className="text-[#c6c6cc] text-xs">Your future curricula.</p>
        </div>

        {/* Selection List */}
        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
          {selectedInterests.length === 0 ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-white/5 mx-auto flex items-center justify-center text-xl text-[#909096]">
                📋
              </div>
              <p className="text-[#c6c6cc] text-xs">No subjects selected yet.</p>
            </div>
          ) : (
            selectedInterests.map((subject) => (
              <div
                key={subject}
                className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl text-xs font-semibold text-white animate-in fade-in duration-200"
              >
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff]" />
                  {subject}
                </span>
                <button
                  type="button"
                  onClick={() => onToggleInterest(subject)}
                  className="text-[#909096] hover:text-red-400 text-sm font-bold ml-2 cursor-pointer transition-colors"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        {/* Personalization Strength Bar */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-[#c6c6cc]">Personalization Strength</span>
            <span className="text-[#00d2ff]">{strengthPercent}%</span>
          </div>
          <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#0043eb] to-[#00d2ff] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(0,210,255,0.8)]"
              style={{ width: `${strengthPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-[#909096] text-center">
            Select at least 3 subjects for optimal results.
          </p>
        </div>

        {/* Begin Journey Button */}
        <Button
          type="button"
          onClick={onSubmit}
          disabled={selectedInterests.length === 0}
          className="w-full h-12 rounded-2xl bg-gradient-to-r from-[#0043eb] to-[#00d2ff] hover:from-[#003ad6] hover:to-[#00b8e6] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,67,235,0.4)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Begin Journey →
        </Button>
      </Card>
    </aside>
  );
}
