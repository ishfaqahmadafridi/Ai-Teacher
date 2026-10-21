'use client';

import { memo } from 'react';
import { useInputBarDockContainer } from '../../../hooks/useInputBarDockContainer';
import { LeaveClassButton } from './LeaveClassButton';
import { RaiseHandButton } from './RaiseHandButton';
import { QuestionTextInput } from './QuestionTextInput';
import { VoiceMicButton } from './VoiceMicButton';
import { SubmitAskButton } from './SubmitAskButton';
import { ClassroomChatInboxPopover } from './ClassroomChatInboxPopover';
import { DynamicEmojiReactionPopover } from '@/features/classroom/components/lazyComponents';

export const InputBarDockContainer = memo(function InputBarDockContainer() {
  const {
    topic,
    questionNotice,
    inputText,
    loading,
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
    <>
    {questionNotice && <p role="status" className="px-2 text-xs text-dashboard-muted">{questionNotice}</p>}
    <div className="flex flex-wrap items-center justify-between gap-3 bg-dashboard-panel border border-dashboard-border rounded-2xl p-2.5 px-4 shadow-2xl backdrop-blur-xl transition-all">
      {/* 1. Left Section: Zoom Controls (Mic, Raise Hand, Reactions, Chat Inbox) */}
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <RaiseHandButton handRaised={handRaised} onToggleHand={handleToggleHand} />
        <DynamicEmojiReactionPopover
          showEmojiPicker={showEmojiPicker}
          onTogglePicker={() => setShowEmojiPicker((prev) => !prev)}
          onSendReaction={handleSendReaction}
        />
        <ClassroomChatInboxPopover />
      </div>

      {/* 2. Center Section: Prominent Integrated Ask AI Input Box */}
      <div className="min-w-0 basis-full xl:basis-auto xl:flex-1 order-first xl:order-none bg-dashboard-subtle border border-dashboard-border focus-within:border-blue-400/80 focus-within:ring-2 focus-within:ring-blue-400/20 rounded-xl px-3 py-1.5 flex items-center gap-2 transition-all">
        <QuestionTextInput
          topic={topic}
          inputText={inputText}
          onChange={updateInputText}
          onKeyDown={handleKeyDown}
          disabled={loading}
        />
        <VoiceMicButton disabled={loading && !isListening} isListening={isListening} onMicClick={handleMicClick} />
        <SubmitAskButton
          loading={loading}
          disabled={loading || !inputText.trim()}
          onSubmit={handleSubmit}
        />
      </div>

      {/* 3. Right Section: Iconic Zoom Red Leave Meeting Button */}
      <div className="shrink-0 flex items-center">
        <LeaveClassButton />
      </div>
    </div>
    </>
  );
});

InputBarDockContainer.displayName = 'InputBarDockContainer';
