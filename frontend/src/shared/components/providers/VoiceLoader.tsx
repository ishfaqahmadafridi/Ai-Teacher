'use client';
import { memo } from 'react';
import { useVoiceLoader } from '@/shared/hooks/useVoiceLoader';

export const VoiceLoader = memo(function VoiceLoader() {
  useVoiceLoader();
  return null;
});
VoiceLoader.displayName = 'VoiceLoader';
