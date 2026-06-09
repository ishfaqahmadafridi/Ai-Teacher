import type { VoiceErrorBarProps } from '../../../types/classroom/classroom.types';

export default function VoiceErrorBar({ voiceError }: VoiceErrorBarProps) {
  if (!voiceError) return null;

  return (
    <div className="flex-shrink-0 mx-4 mb-1 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-xs">
      🎤 {voiceError}
    </div>
  );
}
