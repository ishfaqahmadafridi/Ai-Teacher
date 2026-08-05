'use client';

import { memo } from 'react';
import { useVoiceSelector } from '../../hooks/useVoiceSelector';
import type { VoiceSelectorProps } from '../../types/sidebar.types';

const CHEVRON_SVG_URL = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394a3b8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`;

export const VoiceSelector = memo(function VoiceSelector({
  className = '',
}: VoiceSelectorProps) {
  const { voices, selectedVoice, handleVoiceChange } = useVoiceSelector();

  if (!voices.length) return null;

  return (
    <div
      className={`flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-slate-300 focus-within:border-blue-500/50 transition-colors w-full ${className}`}
    >
      <span className="text-slate-400 flex-shrink-0">🔊</span>
      <select
        value={selectedVoice}
        onChange={(e) => handleVoiceChange(e.target.value)}
        className="bg-transparent border-none text-slate-200 text-xs focus:outline-none cursor-pointer w-full p-0 pr-6"
        style={{
          border: 'none',
          appearance: 'none',
          backgroundImage: CHEVRON_SVG_URL,
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.25rem',
        }}
      >
        <option value="" className="bg-[#121824] text-slate-200">Default Voice</option>
        {voices
          .filter((v) => v.lang.startsWith('en'))
          .map((v) => (
            <option key={v.voiceURI} value={v.voiceURI} className="bg-[#121824] text-slate-200">
              {v.name.replace('Google', '').replace('Microsoft', '').trim()}
            </option>
          ))}
      </select>
    </div>
  );
});

VoiceSelector.displayName = 'VoiceSelector';
