import AskChatHeader from './AskChatHeader';
import AskWelcomeScreen from './AskWelcomeScreen';
import AskMessageList from './AskMessageList';
import AskInputBar from './AskInputBar';
import type { AskChatPanelProps } from '../../../types/classroom/classroom.types';

export default function AskChatPanel({
  voices,
  selectedVoice,
  setSelectedVoice,
  autoSpeak,
  setAutoSpeak,
  handleNewChat,
  messages,
  loading,
  error,
  speakingId,
  toggleSpeak,
  sendMessage,
  bottomRef,
  input,
  setInput,
  textareaRef,
  resizeTextarea,
}: AskChatPanelProps) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Chat header */}
      <AskChatHeader
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        handleNewChat={handleNewChat}
      />

      {/* Messages */}
      {messages.length === 0 && !loading ? (
        <AskWelcomeScreen sendMessage={sendMessage} />
      ) : (
        <AskMessageList
          messages={messages}
          loading={loading}
          error={error}
          speakingId={speakingId}
          toggleSpeak={toggleSpeak}
          sendMessage={sendMessage}
          bottomRef={bottomRef}
        />
      )}

      {/* Input bar */}
      <AskInputBar
        input={input}
        setInput={setInput}
        loading={loading}
        sendMessage={sendMessage}
        textareaRef={textareaRef}
        resizeTextarea={resizeTextarea}
      />
    </div>
  );
}
