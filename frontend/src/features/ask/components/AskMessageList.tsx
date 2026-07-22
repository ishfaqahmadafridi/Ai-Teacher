import type { AskMessageListProps } from '../types';
import { AskMessageItem } from './AskMessageItem';

export function AskMessageList({
  messages,
  loading,
  error,
  speakingId,
  onSpeak,
  messagesEndRef,
}: AskMessageListProps) {
  return (
    <main className="flex-1 pt-24 pb-28 relative overflow-y-auto px-4 md:px-0 flex flex-col items-center custom-scrollbar">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto text-center px-4 my-auto">
          <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-3xl animate-bounce">
            💬
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Interactive Chat Assistant</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Ask anything about formulas, concepts, algorithms, code reviews, or physics textbooks. The AI Tutor is ready to assist you.
            </p>
          </div>
        </div>
      ) : (
        <div className="w-full max-w-3xl flex-1 flex flex-col space-y-6 px-2">
          {messages.map((msg) => (
            <AskMessageItem
              key={msg.id}
              msg={msg}
              speakingId={speakingId}
              onSpeak={onSpeak}
            />
          ))}

          {/* Loading / Typing Indicator */}
          {loading && (
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 opacity-80 pl-2">
                <div className="flex gap-1">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '100ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '200ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
                <span className="text-xs text-slate-400 italic">NeuroLearn is formulating a response...</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3.5 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 text-sm text-center">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      )}
    </main>
  );
}
