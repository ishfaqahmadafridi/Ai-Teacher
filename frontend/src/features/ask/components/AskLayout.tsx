'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAskSession } from '@/features/ask/hooks/useAskSession';
import { useVoiceInput } from '@/features/classroom/hooks/useVoiceInput';
import { FormulaBlock } from '@/shared/components/FormulaBlock';
import { VoiceSelector } from '@/features/classroom/components/sidebar/VoiceSelector';

export function AskLayout() {
  const {
    messages,
    loading,
    error,
    speakingId,
    sendMessage,
    speakMessage,
    clearChat,
  } = useAskSession();

  const [input, setInput] = useState('');
  const { isListening, startListening, stopListening } = useVoiceInput();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleMicClick = () => {
    if (isListening) stopListening();
    else startListening();
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-slate-950 text-white font-sans overflow-hidden">
      {/* Top Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link
            href="/classroom"
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-all bg-slate-800 hover:bg-slate-700 px-3.5 py-2 rounded-xl border border-slate-700/60"
          >
            ← Back to Classroom
          </Link>
          <h1 className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Q&A with Prof. Gemini
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-48 shrink-0">
            <VoiceSelector />
          </div>
          <button
            onClick={clearChat}
            disabled={messages.length === 0}
            className="text-xs text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 px-3.5 py-2 rounded-xl transition-all disabled:opacity-40"
          >
            Clear Chat
          </button>
        </div>
      </header>

      {/* Main chat window */}
      <main className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 max-w-md mx-auto text-center">
            <div className="text-5xl animate-bounce">💬</div>
            <h2 className="text-xl font-bold text-slate-200">Start a Conversation</h2>
            <p className="text-sm text-slate-400">
              Ask anything about physics textbooks, concepts, equations, or problems. Prof. Gemini will explain it comprehensively with formulas.
            </p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {/* Avatar for Assistant */}
                {msg.role === 'assistant' && (
                  <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm shrink-0 border border-violet-500/30 shadow-md">
                    🎓
                  </div>
                )}

                <div
                  className={`relative max-w-[85%] rounded-2xl px-4 py-3 shadow-md flex flex-col gap-1.5 ${
                    msg.role === 'user'
                      ? 'bg-violet-600 text-white rounded-tr-none'
                      : 'bg-slate-900 border border-slate-800/80 text-slate-200 rounded-tl-none'
                  }`}
                >
                  {/* Speaker button for assistant */}
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => speakMessage(msg.id, msg.content)}
                      className={`absolute top-3 right-3 p-1.5 rounded-lg transition-all ${
                        speakingId === msg.id
                          ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30 animate-pulse'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                      title={speakingId === msg.id ? 'Mute' : 'Speak'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                      </svg>
                    </button>
                  )}

                  <div className={`text-sm leading-relaxed prose prose-invert prose-sm ${msg.role === 'assistant' ? 'pr-8' : ''}`}>
                    <FormulaBlock>{msg.content}</FormulaBlock>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center text-sm shrink-0 border border-violet-500/30 animate-pulse">
                  🎓
                </div>
                <div className="bg-slate-900 border border-slate-800/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" style={{ animationDelay: '300ms' }} />
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

      {/* Input area */}
      <footer className="shrink-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-end gap-2 bg-slate-800 border border-slate-700/60 rounded-2xl px-4 py-3">
          <textarea
            rows={2}
            placeholder="Ask Prof. Gemini a follow-up question…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 resize-none focus:outline-none disabled:opacity-50"
          />

          {/* Mic */}
          <button
            onClick={handleMicClick}
            className={`p-2.5 rounded-xl transition-all duration-200 shrink-0 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600 hover:text-white'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2H3v2a9 9 0 0 0 8 8.94V23h2v-2.06A9 9 0 0 0 21 12v-2h-2z"/>
            </svg>
          </button>

          {/* Send */}
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 flex items-center gap-2"
          >
            Send
          </button>
        </div>
      </footer>
    </div>
  );
}
