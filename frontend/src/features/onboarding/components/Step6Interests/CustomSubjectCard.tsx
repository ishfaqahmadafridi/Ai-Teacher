'use client';

import { memo } from 'react';
import { Sparkles, Plus, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { CustomSubjectCardProps } from '../../types';

function CustomSubjectCardComponent({
  customInput,
  onCustomInputChange,
  onAddCustom,
  customSuggestions,
  selectedInterests,
  onToggleInterest,
}: CustomSubjectCardProps) {
  return (
    <Card className="bg-[#070D1A]/80 border border-[#1E293B] backdrop-blur-xl rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden font-['Hanken_Grotesk',sans-serif]">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#38BDF8]" />
          <h3 className="text-sm font-extrabold text-white tracking-wide uppercase">
            Can&apos;t find your field? Add custom subject
          </h3>
        </div>
        <p className="text-[#94A3B8] text-xs">
          Enter your specific major, degree, or specialty.
        </p>
      </div>

      {/* Input Box & Add Button */}
      <div className="flex items-center gap-3 relative z-10">
        <Input
          type="text"
          value={customInput}
          onChange={(e) => onCustomInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddCustom(customInput);
            }
          }}
          placeholder="e.g. Neuroscience, Astrophysics, FinTech…"
          className="h-12 bg-black/40 border border-white/15 rounded-2xl px-4 text-white text-sm placeholder:text-[#94A3B8] focus-visible:ring-[#2563EB]"
        />
        <Button
          type="button"
          onClick={() => onAddCustom(customInput)}
          disabled={!customInput.trim()}
          className="h-12 px-6 rounded-2xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#2563eb]/30 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add</span>
        </Button>
      </div>

      {/* Suggestions Pills */}
      {customSuggestions.length > 0 && (
        <div className="space-y-2.5 relative z-10 pt-2 border-t border-[#1E293B]">
          <span className="font-['JetBrains_Mono',monospace] text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            Suggested Specialties
          </span>
          <div className="flex flex-wrap gap-2">
            {customSuggestions.map((suggestion) => {
              const isSelected = selectedInterests.includes(suggestion);
              return (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => onToggleInterest(suggestion)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#2563EB]/30 border border-[#2563EB] text-[#38BDF8]'
                      : 'bg-[#0F172A] border border-[#1E293B] text-[#94A3B8] hover:border-white/20 hover:text-white'
                  }`}
                >
                  {isSelected ? <Check className="w-3 h-3 text-[#38BDF8]" /> : <Plus className="w-3 h-3" />}
                  <span>{suggestion}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </Card>
  );
}

export const CustomSubjectCard = memo(CustomSubjectCardComponent);
CustomSubjectCard.displayName = 'CustomSubjectCard';
