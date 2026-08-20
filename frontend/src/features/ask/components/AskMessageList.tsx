import Image from 'next/image';
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
          <div className="relative w-20 h-20 shrink-0 mb-2">
            <Image
              src="/neurolearn-brain-logo.png"
              alt="NEUROLEARN Brain Logo"
              fill
              sizes="80px"
              className="object-contain rounded-2xl mix-blend-screen"
              style={{
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 0 20px rgba(56,189,248,0.9))',
              }}
              priority
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white mb-2 font-['Outfit',sans-serif]">
              Interactive Chat Assistant
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed font-['Hanken_Grotesk',sans-serif]">
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
