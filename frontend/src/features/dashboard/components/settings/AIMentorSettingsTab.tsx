'use client';

import { memo } from 'react';
import { Volume2, Sparkles, LayoutGrid } from 'lucide-react';
import type { SettingsTabProps } from '../../types/settings.types';

export const AIMentorSettingsTab = memo(function AIMentorSettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* Voice Streaming Toggle */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">AI Voice Audio Streaming</h4>
            <p className="text-xs text-[#94A3B8]">
              Stream real-time voice lectures during Ask Prof. Gemini sessions.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange('voiceStreaming', !settings.voiceStreaming)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.voiceStreaming ? 'bg-[#2563EB]' : 'bg-[#1E293B]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              settings.voiceStreaming ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      {/* Explanation Depth Level */}
      <div className="p-4 rounded-2xl bg-[#090D16] border border-[#1E293B] space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C4B5FD] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Lecture Explanation Depth</h4>
            <p className="text-xs text-[#94A3B8]">
              Adjust how detailed AI Prof. Gemini formats explanations and formulas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {(
            [
              { id: 'beginner', title: 'Beginner', desc: 'Simple step-by-step guidance' },
              { id: 'standard', title: 'Standard', desc: 'Balanced academic depth' },
              { id: 'advanced', title: 'Advanced', desc: 'Rigorous mathematical proofs' },
            ] as const
          ).map((level) => {
            const isSelected = settings.explanationDepth === level.id;
            return (
              <button
                key={level.id}
                type="button"
                onClick={() => onChange('explanationDepth', level.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#2563EB]/20 border-[#38BDF8] text-white'
                    : 'bg-[#070D1A] border-[#1E293B] text-[#94A3B8] hover:text-white'
                }`}
              >
                <div className="font-bold text-xs">{level.title}</div>
                <div className="text-[11px] opacity-80 mt-0.5">{level.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Auto Blackboard Diagrams */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#090D16] border border-[#1E293B]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] shrink-0">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Automated Blackboard Diagrams</h4>
            <p className="text-xs text-[#94A3B8]">
              Auto-generate physics blackboard diagrams during live teacher explanations.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onChange('autoBlackboardDiagrams', !settings.autoBlackboardDiagrams)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
            settings.autoBlackboardDiagrams ? 'bg-[#10B981]' : 'bg-[#1E293B]'
          }`}
        >
          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
              settings.autoBlackboardDiagrams ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
});

AIMentorSettingsTab.displayName = 'AIMentorSettingsTab';
