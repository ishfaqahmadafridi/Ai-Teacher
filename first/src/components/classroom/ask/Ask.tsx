import React from 'react';
import { useAskSession } from '../../../hooks/classroom/useAskSession';
import AskSidebar from './AskSidebar';
import AskChatPanel from './AskChatPanel';

export const Ask: React.FC = () => {
  const session = useAskSession();

  return (
    <div
      className="flex flex-col h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.07]"
      style={{
        background: 'linear-gradient(160deg, rgba(15,23,42,0.97) 0%, rgba(9,18,36,0.99) 100%)',
      }}
    >
      {/* ── Sidebar + Chat layout ── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left sidebar ── */}
        <AskSidebar sendMessage={session.sendMessage} handleNewChat={session.handleNewChat} />

        {/* ── Main chat panel ── */}
        <AskChatPanel
          voices={session.voices}
          selectedVoice={session.selectedVoice}
          setSelectedVoice={session.setSelectedVoice}
          autoSpeak={session.autoSpeak}
          setAutoSpeak={session.setAutoSpeak}
          handleNewChat={session.handleNewChat}
          messages={session.messages}
          loading={session.loading}
          error={session.error}
          speakingId={session.speakingId}
          toggleSpeak={session.toggleSpeak}
          sendMessage={session.sendMessage}
          bottomRef={session.bottomRef}
          input={session.input}
          setInput={session.setInput}
          textareaRef={session.textareaRef}
          resizeTextarea={session.resizeTextarea}
        />
      </div>
    </div>
  );
};

export default Ask;
