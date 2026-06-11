import AskListenButton from './AskListenButton';
import AskDifferentAnalogyButton from './AskDifferentAnalogyButton';
import AskGotItButton from './AskGotItButton';
import type { AskMessageActionsProps } from '../../../types/classroom/classroom.types';

export default function AskMessageActions({
  msgId,
  msgContent,
  speakingId,
  toggleSpeak,
  sendMessage,
}: AskMessageActionsProps) {
  return (
    <div className="flex items-center gap-2 px-1">
      <AskListenButton
        msgId={msgId}
        msgContent={msgContent}
        speakingId={speakingId}
        toggleSpeak={toggleSpeak}
      />
      <AskDifferentAnalogyButton sendMessage={sendMessage} />
      <AskGotItButton sendMessage={sendMessage} />
    </div>
  );
}

