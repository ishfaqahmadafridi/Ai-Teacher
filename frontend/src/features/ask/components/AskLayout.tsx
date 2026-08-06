'use client';

import { useAskLayout } from '../hooks/useAskLayout';
import { AskSidebar } from './AskSidebar';
import { AskHeader } from './AskHeader';
import { AskMessageList } from './AskMessageList';
import { AskInputFooter } from './AskInputFooter';

export function AskLayout() {
  const {
    messages,
    loading,
    error,
    speakingId,
    speakMessage,
    input,
    setInput,
    drawerOpen,
    setDrawerOpen,
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
        onClose={() => setDrawerOpen(false)} 
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <AskHeader 
          drawerOpen={drawerOpen} 
          onOpenDrawer={() => setDrawerOpen(true)} 
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
}

export default AskLayout;
