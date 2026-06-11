import React from 'react';
import AskTextarea from './AskTextarea';
import AskSubmitButton from './AskSubmitButton';
import type { AskInputBarProps } from '../../../types/classroom/classroom.types';

export default function AskInputBar({
  input,
  setInput,
  loading,
  sendMessage,
  textareaRef,
  resizeTextarea,
}: AskInputBarProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <div className="flex-shrink-0 border-t border-white/[0.06] bg-black/20 px-4 md:px-6 py-4">
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <AskTextarea
          input={input}
          setInput={setInput}
          textareaRef={textareaRef}
          resizeTextarea={resizeTextarea}
          handleKeyDown={handleKeyDown}
        />
        <AskSubmitButton loading={loading} disabled={loading || !input.trim()} />
      </form>
      <p className="text-[11px] text-slate-600 mt-2 text-center">
        Enter to send · Shift+Enter for new line · Powered by Gemini Flash
      </p>
    </div>
  );
}
