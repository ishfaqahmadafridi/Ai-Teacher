'use client';

import { memo } from 'react';
import { useAppSelector, useAppDispatch } from '@/hooks/useAppStore';
import { setSelectedVoice } from '@/features/classroom/state/classroomSlice';
import type { VoiceSelectorProps } from '../../../types/sidebar.types';

export const VoiceSelector = memo(function VoiceSelector({ className = '' }: VoiceSelectorProps) {
  const dispatch = useAppDispatch();
  const voices = useAppSelector((s) => s.classroom.voices);
  const selectedVoice = useAppSelector((s) => s.classroom.selectedVoice);

  if (!voices.length) return null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">
        🔊 Voice
      </label>
      <select
        value={selectedVoice}
        onChange={(e) => dispatch(setSelectedVoice(e.target.value))}
        className="bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500 w-full"
      >
        <option value="">Default voice</option>
        {voices
          .filter((v) => v.lang.startsWith('en'))
          .map((v) => (
            <option key={v.voiceURI} value={v.voiceURI}>
              {v.name}
            </option>
          ))}
      </select>
    </div>
  );
});

VoiceSelector.displayName = 'VoiceSelector';
