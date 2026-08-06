'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CustomSubjectCardProps {
  customInput: string;
  onCustomInputChange: (val: string) => void;
  onAddCustom: (subject: string) => void;
  customSuggestions: string[];
  selectedInterests: string[];
  onToggleInterest: (name: string) => void;
}

export function CustomSubjectCard({
  customInput,
  onCustomInputChange,
  onAddCustom,
  customSuggestions,
  selectedInterests,
  onToggleInterest,
}: CustomSubjectCardProps) {
  return (
    <Card className="p-6 rounded-2xl border border-white/10 bg-gradient-to-r from-white/[0.03] to-white/[0.01] backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span>🚀</span> Write Your Own Subject or Field
          </h4>
          <p className="text-xs text-[#c6c6cc] mt-0.5">
            Don't see your specific field? Type any topic, skill, or specialization below to add it.
          </p>
        </div>
      </div>

      {/* Input & Add Button */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onAddCustom(customInput);
        }}
        className="flex gap-3"
      >
        <Input
          type="text"
          value={customInput}
          onChange={(e) => onCustomInputChange(e.target.value)}
          placeholder="e.g. Quantum Computing, Neuroscience, Game Dev..."
          className="flex-1 h-11 bg-black/40 border border-white/10 rounded-xl px-4 text-white placeholder:text-white/30 focus-visible:border-[#00d2ff] focus-visible:ring-0 text-xs font-medium"
        />
        <Button
          type="submit"
          disabled={!customInput.trim()}
          className="h-11 px-5 rounded-xl bg-gradient-to-r from-[#0043eb] to-[#00d2ff] hover:from-[#003ad6] hover:to-[#00b8e6] text-white font-bold text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,67,235,0.5)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + Add Field
        </Button>
      </form>

      {/* Quick Suggestion Tags */}
      <div className="flex flex-wrap items-center gap-2 pt-2">
        <span className="text-[11px] text-[#909096] font-semibold">Quick Suggestions:</span>
        {customSuggestions.map((tag) => {
          const isSelected = selectedInterests.includes(tag);
          return (
            <Button
              key={tag}
              type="button"
              variant="ghost"
              onClick={() => onToggleInterest(tag)}
              className={`h-auto px-3 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#0043eb]/30 border border-[#b8c3ff] text-[#b8c3ff] hover:bg-[#0043eb]/40'
                  : 'bg-white/5 border border-white/10 text-[#c6c6cc] hover:text-white hover:border-white/20'
              }`}
            >
              + {tag}
            </Button>
          );
        })}
      </div>
    </Card>
  );
}
