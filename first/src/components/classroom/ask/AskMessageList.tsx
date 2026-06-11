import AskMessageItem from './AskMessageItem';
import AskTypingIndicator from './AskTypingIndicator';
import AskErrorMessage from './AskErrorMessage';
import type { AskMessageListProps } from '../../../types/classroom/classroom.types';

export default function AskMessageList({
  messages,
  loading,
  error,
  speakingId,
  toggleSpeak,
  sendMessage,
  bottomRef,
}: AskMessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8">
      {messages.map((msg) => (
        <AskMessageItem
          key={msg.id}
          msg={msg}
          speakingId={speakingId}
          toggleSpeak={toggleSpeak}
          sendMessage={sendMessage}
        />
      ))}
      <AskTypingIndicator loading={loading} />
      <AskErrorMessage error={error} />
      <div ref={bottomRef} />
    </div>
  );
}

