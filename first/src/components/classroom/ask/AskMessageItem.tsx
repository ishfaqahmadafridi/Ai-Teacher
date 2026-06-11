import AskMessageAvatar from './AskMessageAvatar';
import AskMessageBubble from './AskMessageBubble';
import AskMessageActions from './AskMessageActions';
import type { AskMessageItemProps } from '../../../types/classroom/classroom.types';

export default function AskMessageItem({
  msg,
  speakingId,
  toggleSpeak,
  sendMessage,
}: AskMessageItemProps) {
  return (
    <div className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <AskMessageAvatar role={msg.role} />

      <div
        className={`flex flex-col gap-2 max-w-[88%] ${
          msg.role === 'user' ? 'items-end' : 'items-start'
        }`}
      >
        {/* Bubble */}
        <AskMessageBubble role={msg.role} content={msg.content} />

        {/* Action row under assistant messages */}
        {msg.role === 'assistant' && (
          <AskMessageActions
            msgId={msg.id}
            msgContent={msg.content}
            speakingId={speakingId}
            toggleSpeak={toggleSpeak}
            sendMessage={sendMessage}
          />
        )}
      </div>
    </div>
  );
}

