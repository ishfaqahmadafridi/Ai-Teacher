'use client';

import { memo } from 'react';
import {
  AIAvatarModelCard,
  SpeechRateCard,
  VoiceStreamingCard,
  ExplanationDepthCard,
  AutoBlackboardCard,
} from './ai-mentor';
import type { SettingsTabProps } from '../../types/settings.types';

export const AIMentorSettingsTab = memo(function AIMentorSettingsTab({
  settings,
  onChange,
  className = '',
}: SettingsTabProps) {
  return (
    <div className={`space-y-6 font-['Hanken_Grotesk',sans-serif] ${className}`}>
      {/* AI Professor Avatar Model Card */}
      <AIAvatarModelCard
        aiAvatarModel={settings.aiAvatarModel}
        onChangeModel={(model) => onChange('aiAvatarModel', model)}
      />

      {/* Speech Speed Rate Card */}
      <SpeechRateCard
        speechRate={settings.speechRate}
        onChangeSpeechRate={(rate) => onChange('speechRate', rate)}
      />

      {/* Voice Audio Streaming Card */}
      <VoiceStreamingCard
        voiceStreaming={settings.voiceStreaming}
        onToggleVoiceStreaming={() => onChange('voiceStreaming', !settings.voiceStreaming)}
      />

      {/* Lecture Explanation Depth Card */}
      <ExplanationDepthCard
        explanationDepth={settings.explanationDepth}
        onChangeDepth={(depth) => onChange('explanationDepth', depth)}
      />

      {/* Automated Blackboard Diagrams Card */}
      <AutoBlackboardCard
        autoBlackboardDiagrams={settings.autoBlackboardDiagrams}
        onToggleAutoBlackboard={() => onChange('autoBlackboardDiagrams', !settings.autoBlackboardDiagrams)}
      />
    </div>
  );
});

AIMentorSettingsTab.displayName = 'AIMentorSettingsTab';
