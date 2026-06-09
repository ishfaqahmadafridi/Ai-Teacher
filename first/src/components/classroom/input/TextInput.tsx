import { useRef, useEffect, type KeyboardEvent } from 'react';

interface TextInputProps {
  inputText: string;
  setInputText: (text: string) => void;
  isListening: boolean;
  onKeyDown: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
}

export default function TextInput({
  inputText,
  setInputText,
  isListening,
  onKeyDown,
}: TextInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  // Re-run resize when inputText changes
  useEffect(() => {
    resizeTextarea();
  }, [inputText]);

  return (
    <div className="flex-1 relative">
      <textarea
        ref={textareaRef}
        value={inputText}
        onChange={e => setInputText(e.target.value)}
        onKeyDown={onKeyDown}
        rows={1}
        placeholder={isListening ? '🎤 Listening… speak your question' : 'Ask your professor… (Enter to send)'}
        className="w-full px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500
          bg-slate-900/70 border border-white/[0.08] focus:border-blue-500/50 outline-none
          resize-none transition-all leading-relaxed max-h-32 overflow-y-auto"
        style={{ minHeight: '52px' }}
      />
    </div>
  );
}
