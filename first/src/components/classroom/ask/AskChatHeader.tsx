import AskChatProfile from './AskChatProfile';
import AskChatSettings from './AskChatSettings';
import type { AskChatHeaderProps } from '../../../types/classroom/classroom.types';

export default function AskChatHeader({
  voices,
  selectedVoice,
  setSelectedVoice,
  autoSpeak,
  setAutoSpeak,
  handleNewChat,
}: AskChatHeaderProps) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-black/10 flex-shrink-0">
      <AskChatProfile />
      <AskChatSettings
        voices={voices}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
        autoSpeak={autoSpeak}
        setAutoSpeak={setAutoSpeak}
        handleNewChat={handleNewChat}
      />
    </div>
  );
}
