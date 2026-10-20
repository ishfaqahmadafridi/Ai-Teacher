'use client';

import { memo } from 'react';
import { ProjectSettingsModal } from '@/features/dashboard/components/settings/ProjectSettingsModal';
import { AskHistoryView } from '../chat/AskHistoryView';
import { AskLearningPathsView } from '../chat/AskLearningPathsView';
import { useAskLayout } from '../../hooks/useAskLayout';
import { AskSidebar } from '../sidebar';
import { AskHeader } from './AskHeader';
import { AskMessageList } from '../chat';
import { AskInputFooter } from '../input';

export const AskLayout = memo(function AskLayout() {
  const {
    activeView, handleNavigate, handleReturnToChat,
    isSettingsOpen, handleOpenSettings, handleCloseSettings,
    userName, userInitials, registeredCourses, coursesLoading, coursesError,
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
    <div className="flex h-dvh w-full bg-dashboard-bg text-dashboard-text font-sans overflow-hidden relative">
      {/* Sidebar Drawer */}
      <AskSidebar
        activeView={activeView}
        onNavigate={handleNavigate}
        onOpenSettings={handleOpenSettings}
        userName={userName}
        userInitials={userInitials}
        drawerOpen={drawerOpen}
        onClose={handleCloseDrawer}
      />

      {/* Main Layout Area */}
      <div className="min-w-0 flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <AskHeader
          drawerOpen={drawerOpen}
          onOpenDrawer={handleOpenDrawer}
        />

        {/* Message Canvas */}
        {activeView === 'active' && <AskMessageList
          messages={messages}
          loading={loading}
          error={error}
          speakingId={speakingId}
          onSpeak={speakMessage}
          messagesEndRef={messagesEndRef}
        />}
        {activeView === 'history' && <AskHistoryView messages={messages} onReturnToChat={handleReturnToChat} />}
        {activeView === 'paths' && <AskLearningPathsView courses={registeredCourses} isLoading={coursesLoading} error={coursesError} />}

        {/* Footer Input Bar */}
        {activeView === 'active' && <AskInputFooter
          input={input}
          setInput={setInput}
          onSend={handleSend}
          loading={loading}
          isListening={isListening}
          onMicClick={handleMicClick}
        />}
      </div>
      {isSettingsOpen && <ProjectSettingsModal isOpen onClose={handleCloseSettings} />}
    </div>
  );
});

AskLayout.displayName = 'AskLayout';
export default AskLayout;
