import type { AskTextareaProps } from '../../../types/classroom/classroom.types';

export default function AskTextarea({
  input,
  setInput,
  textareaRef,
  resizeTextarea,
  handleKeyDown,
}: AskTextareaProps) {
  return (
    <div className="relative flex-1">
      {/* glow ring on focus */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none" />
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          resizeTextarea();
        }}
        onKeyDown={handleKeyDown}
        rows={1}
        placeholder="Ask your professor… (Enter to send, Shift+Enter for new line)"
        className="peer w-full px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500
          bg-slate-900/70 border border-white/[0.08] focus:border-blue-500/50 outline-none
          resize-none transition-all leading-relaxed max-h-40 overflow-y-auto"
        style={{ minHeight: '52px' }}
      />
    </div>
  );
}
