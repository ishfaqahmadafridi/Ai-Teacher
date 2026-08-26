'use client';

import { memo } from 'react';
import { X } from 'lucide-react';
import { useInputBar } from '../../hooks/useInputBar';
import {
  LeaveClassButton,
  RaiseHandButton,
  EmojiReactionPopover,
  QuestionTextInput,
  VoiceMicButton,
  SubmitAskButton,
  PlaybackControlsRow,
} from './toolbar';

export const InputBar = memo(function InputBar() {
  const {
    inputText,
    loading,
    isPlaying,
    isPaused,
    voiceError,
    localError,
    chunks,
    isListening,
    handRaised,
    showEmojiPicker,
    reactionToast,
    setShowEmojiPicker,
    handleSubmit,
    handleKeyDown,
    handleMicClick,
    handleToggleHand,
    handleSendReaction,
    handlePlayPause,
    stop,
    clearErrors,
    updateInputText,
  } = useInputBar();

  return (
    <div className="flex flex-col gap-2.5 font-sans max-w-6xl mx-auto w-full px-2">
      {/* Voice or System Error Banner */}
      {(voiceError || localError) && (
        <div className="text-red-300 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-lg backdrop-blur-md">
          <span className="font-medium">{voiceError ?? localError}</span>
          <button
            type="button"
            className="text-red-400 hover:text-white transition-colors cursor-pointer"
            onClick={clearErrors}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Reaction Toast Notification */}
      {reactionToast && (
        <div className="self-center px-4 py-1.5 rounded-full bg-slate-900/95 border border-violet-500/40 text-xs font-medium text-violet-300 shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex items-center gap-2 backdrop-blur-xl">
          <span className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
          <span>{reactionToast}</span>
        </div>
      )}

      {/* Authentic Zoom Live Meeting Control Dock */}
      <div className="flex items-center justify-between gap-4 bg-[#0A0E1A]/95 border border-slate-800/90 rounded-2xl p-2.5 px-4 shadow-2xl backdrop-blur-xl transition-all">
        {/* 1. Left Section: Zoom Controls (Mic, Raise Hand, Reactions) */}
        <div className="flex items-center gap-2 shrink-0">
          <VoiceMicButton isListening={isListening} onMicClick={handleMicClick} />
          <RaiseHandButton handRaised={handRaised} onToggleHand={handleToggleHand} />
          <EmojiReactionPopover
            showEmojiPicker={showEmojiPicker}
            onTogglePicker={() => setShowEmojiPicker((prev) => !prev)}
            onSendReaction={handleSendReaction}
          />
        </div>

        {/* 2. Center Section: Prominent Integrated Ask AI Input Box */}
        <div className="flex-1 max-w-2xl bg-[#060913] border border-slate-800 focus-within:border-violet-500/80 focus-within:ring-2 focus-within:ring-violet-500/20 rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all">
          <QuestionTextInput
            inputText={inputText}
            onChange={updateInputText}
            onKeyDown={handleKeyDown}
            disabled={loading || isPlaying}
          />
          <SubmitAskButton
            loading={loading}
            disabled={loading || isPlaying || !inputText.trim()}
            onSubmit={handleSubmit}
          />
        </div>

        {/* 3. Right Section: Iconic Zoom Red Leave Meeting Button */}
        <div className="shrink-0 flex items-center">
          <LeaveClassButton />
        </div>
      </div>

      {/* Playback Controls Row */}
      {chunks.length > 0 && (
        <PlaybackControlsRow
          chunksLength={chunks.length}
          isPlaying={isPlaying}
          isPaused={isPaused}
          onPlayPause={handlePlayPause}
          onStop={stop}
        />
      )}
    </div>
  );
});

InputBar.displayName = 'InputBar';
