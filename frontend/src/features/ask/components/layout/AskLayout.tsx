'use client';

import { memo } from 'react';
import { useAskLayout } from '../../hooks/useAskLayout';
import { AskSidebar } from '../sidebar';
import { AskHeader } from './AskHeader';
import { AskMessageList } from '../chat';
import { AskInputFooter } from '../input';

export const AskLayout = memo(function AskLayout() {
  const {
    messages,
    loading,
    error,
    speakingId,
    speakMessage,
    input,
    setInput,
    drawerOpen,
    handleCloseDrawer,
    handleOpenDrawer,
    isListening,
    messagesEndRef,
    handleSend,
    handleMicClick,
  } = useAskLayout();

  return (
    <div className="flex h-screen w-screen bg-[#0a0f18] text-slate-100 font-sans overflow-hidden relative">
      {/* Sidebar Drawer */}
      <AskSidebar 
        drawerOpen={drawerOpen} 
        onClose={handleCloseDrawer}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <AskHeader 
          drawerOpen={drawerOpen} 
          onOpenDrawer={handleOpenDrawer}
        />

        {/* Message Canvas */}
        <AskMessageList 
          messages={messages}
          loading={loading}
          error={error}
          speakingId={speakingId}
          onSpeak={speakMessage}
          messagesEndRef={messagesEndRef}
        />

        {/* Footer Input Bar */}
        <AskInputFooter 
          input={input}
          setInput={setInput}
          onSend={handleSend}
          loading={loading}
          isListening={isListening}
          onMicClick={handleMicClick}
        />
      </div>
    </div>
  );
});

AskLayout.displayName = 'AskLayout';
export default AskLayout;
