'use client';

import { memo } from 'react';
import { Send } from 'lucide-react';
import { useChatInputBar } from '../../../../hooks/useChatInputBar';

export const ChatInputBar = memo(function ChatInputBar() {
  const { inputMsg, setInputMsg, handleSendMessage } = useChatInputBar();

  return (
    <div className="p-2.5 border-t border-slate-800/90 bg-slate-900/80 flex items-center gap-2">
      <input
        type="text"
        placeholder="Send message to classroom chat..."
        value={inputMsg}
        onChange={(e) => setInputMsg(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        className="flex-1 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500/80 font-sans"
      />
      <button
        type="button"
        onClick={handleSendMessage}
        disabled={!inputMsg.trim()}
        className="p-2 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white transition-all cursor-pointer shrink-0"
        title="Send"
      >
        <Send className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

ChatInputBar.displayName = 'ChatInputBar';
