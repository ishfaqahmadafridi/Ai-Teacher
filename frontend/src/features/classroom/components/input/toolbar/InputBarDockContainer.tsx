'use client';

import { memo } from 'react';
import { useInputBarDockContainer } from '../../../hooks/useInputBarDockContainer';
import { LeaveClassButton } from './LeaveClassButton';
import { RaiseHandButton } from './RaiseHandButton';
import { QuestionTextInput } from './QuestionTextInput';
import { VoiceMicButton } from './VoiceMicButton';
import { SubmitAskButton } from './SubmitAskButton';
import { ClassroomChatInboxPopover } from './ClassroomChatInboxPopover';
import { DynamicEmojiReactionPopover } from '@/features/classroom/utilities/lazyComponents';

export const InputBarDockContainer = memo(function InputBarDockContainer() {
  const {
    inputText,
    loading,
    isPlaying,
    isListening,
    handRaised,
    showEmojiPicker,
    setShowEmojiPicker,
    handleSubmit,
    handleKeyDown,
    handleMicClick,
    handleToggleHand,
    handleSendReaction,
    updateInputText,
  } = useInputBarDockContainer();

  return (
    <div className="flex items-center justify-between gap-4 bg-[#0A0E1A]/95 border border-slate-800/90 rounded-2xl p-2.5 px-4 shadow-2xl backdrop-blur-xl transition-all">
      {/* 1. Left Section: Zoom Controls (Mic, Raise Hand, Reactions, Chat Inbox) */}
      <div className="flex items-center gap-2 shrink-0">
        <VoiceMicButton isListening={isListening} onMicClick={handleMicClick} />
        <RaiseHandButton handRaised={handRaised} onToggleHand={handleToggleHand} />
        <DynamicEmojiReactionPopover
          showEmojiPicker={showEmojiPicker}
          onTogglePicker={() => setShowEmojiPicker((prev) => !prev)}
          onSendReaction={handleSendReaction}
        />
        <ClassroomChatInboxPopover />
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
  );
});

InputBarDockContainer.displayName = 'InputBarDockContainer';
