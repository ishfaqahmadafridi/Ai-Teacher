import { KeyboardEvent } from 'react';
import type { AskInputFooterProps } from '../types';
import { Button, Textarea } from './ui';

export function AskInputFooter({
  input,
  setInput,
  onSend,
  loading,
  isListening,
  onMicClick,
}: AskInputFooterProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <footer className="absolute bottom-0 left-0 right-0 z-30 bg-[#0a0f18]/80 backdrop-blur-md px-4 py-4 flex justify-center border-t border-white/5">
      <div className="w-full max-w-3xl glass-panel input-glow rounded-full p-2.5 flex items-center gap-3 shadow-2xl transition-all duration-300">
        
        {/* Text Area */}
        <Textarea
          rows={1}
          placeholder="Ask NeuroLearn anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={loading}
          className="flex-1 bg-transparent border-none outline-none focus:ring-0 text-white placeholder-slate-500 font-sans text-sm resize-none py-1.5 px-3 min-h-[20px] max-h-[120px] custom-scrollbar"
        />

        {/* Voice Mic Button */}
        <Button
          onClick={onMicClick}
          className={`p-2.5 rounded-full transition-all duration-200 shrink-0 border-none cursor-pointer flex items-center justify-center ${
            isListening
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
          }`}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
          </svg>
        </Button>

        {/* Send Trigger */}
        <Button
          onClick={onSend}
          disabled={loading || !input.trim()}
          className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 disabled:cursor-not-allowed text-white shrink-0 border-none cursor-pointer transition-all flex items-center justify-center"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="m22 2-7 20-4-9-9-4Z"/>
            <path d="M22 2 11 13"/>
          </svg>
        </Button>
      </div>
    </footer>
  );
}
