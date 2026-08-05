'use client';

import { memo } from 'react';
import { useFloatingInteractionBar } from '../../hooks/useFloatingInteractionBar';
import { RaiseHandButton } from './RaiseHandButton';
import { QuestionInputField } from './QuestionInputField';
import { MediaControlGroup } from './MediaControlGroup';
import type { FloatingInteractionBarProps } from '../../types/input.types';

export const FloatingInteractionBar = memo(function FloatingInteractionBar({
  className = '',
}: FloatingInteractionBarProps) {
  const {
    inputText,
    loading,
    isPlaying,
    isListening,
    isHandRaised,
    handleInputChange,
    handleSubmitQuestion,
    handleToggleRaiseHand,
    handleToggleMic,
  } = useFloatingInteractionBar();

  return (
    <footer className={`w-full flex justify-center items-center pb-4 z-40 ${className}`}>
      <div className="flex items-center gap-2 md:gap-3 bg-[#333539]/80 backdrop-blur-20 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.4)]">
        {/* Raise Hand Action */}
        <RaiseHandButton
          isHandRaised={isHandRaised}
          onToggleRaiseHand={handleToggleRaiseHand}
        />

        {/* Question Text Input */}
        <QuestionInputField
          value={inputText}
          onChange={handleInputChange}
          onSubmit={handleSubmitQuestion}
          isLoading={loading}
          disabled={loading || isPlaying}
        />

        {/* Vertical Divider */}
        <div className="w-px h-6 bg-white/10 mx-0.5 shrink-0" aria-hidden="true" />

        {/* Mic Control Only */}
        <MediaControlGroup
          isMicOn={isListening}
          isListening={isListening}
          onToggleMic={handleToggleMic}
        />
      </div>
    </footer>
  );
});

FloatingInteractionBar.displayName = 'FloatingInteractionBar';
