'use client';

import { memo } from 'react';
import Link from 'next/link';
import { Mic, Send, Smile, LogOut, Hand, X } from 'lucide-react';
import { useInputBar } from '../../hooks/useInputBar';

export const InputBar = memo(function InputBar() {
  const {
    inputText,
    loading,
    isPlaying,
    isPaused,
    voiceError,
    localError,
    chunks,
    isListening,
    handRaised,
    showEmojiPicker,
    reactionToast,
    setShowEmojiPicker,
    handleSubmit,
    handleKeyDown,
    handleMicClick,
    handleToggleHand,
    handleSendReaction,
    handlePlayPause,
    stop,
    clearErrors,
    updateInputText,
  } = useInputBar();

  return (
    <div className="flex flex-col gap-2 font-sans max-w-5xl mx-auto w-full">
      {/* Voice or System Error Banner */}
      {(voiceError || localError) && (
        <div className="text-red-400 text-xs bg-red-500/10 border border-red-500/30 rounded-xl px-3.5 py-2 flex items-center justify-between shadow-lg">
          <span>{voiceError ?? localError}</span>
          <button
            type="button"
            className="text-red-300 hover:text-white transition-colors cursor-pointer"
            onClick={clearErrors}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Floating Reaction Toast Notification */}
      {reactionToast && (
        <div className="self-center px-3.5 py-1 rounded-full bg-gradient-to-r from-slate-900 via-[#0F172A] to-slate-900 border border-violet-500/40 text-xs font-mono font-bold text-violet-300 shadow-2xl animate-in fade-in zoom-in-95 duration-150 flex items-center gap-1.5">
          <span>{reactionToast}</span>
        </div>
      )}

      {/* Live Classroom Interactive Control Bar */}
      <div className="flex items-center gap-2 bg-[#080D1A]/95 border border-slate-800/90 rounded-2xl p-2 shadow-2xl backdrop-blur-xl relative">
        {/* 1. Leave Class Button */}
        <Link
          href="/dashboard"
          className="px-3 py-2 rounded-xl bg-red-600/15 hover:bg-red-600/30 text-red-300 hover:text-red-200 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm"
          title="Leave Physics Class & return to Dashboard"
        >
          <LogOut className="w-3.5 h-3.5 text-red-400" />
          <span className="hidden sm:inline">Leave</span>
        </Link>

        {/* 2. Raise Hand Button */}
        <button
          type="button"
          onClick={handleToggleHand}
          className={`px-3 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 active:scale-95 shadow-sm ${
            handRaised
              ? 'bg-amber-500/25 text-amber-300 border border-amber-500/60 animate-pulse'
              : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
          }`}
          title={handRaised ? 'Lower Hand' : 'Raise Hand to ask question'}
        >
          <Hand className={`w-3.5 h-3.5 ${handRaised ? 'text-amber-400 fill-amber-400' : 'text-amber-400'}`} />
          <span className="hidden sm:inline">{handRaised ? 'Hand Raised' : 'Raise Hand'}</span>
        </button>

        {/* 3. Emoji Reactions Button + Popover */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker((prev) => !prev)}
            className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white transition-all cursor-pointer shrink-0 active:scale-95"
            title="Send Reaction Emoji"
          >
            <Smile className="w-4 h-4 text-violet-400" />
          </button>

          {/* Emoji Reactions Menu Popover */}
          {showEmojiPicker && (
            <div className="absolute bottom-full left-0 mb-2 z-50 p-1.5 rounded-2xl bg-[#0B132B] border border-slate-700/90 shadow-2xl flex items-center gap-1 animate-in fade-in zoom-in-95 duration-150">
              {[
                { emoji: '👏', label: 'Clap' },
                { emoji: '👍', label: 'Like' },
                { emoji: '❤️', label: 'Love' },
                { emoji: '💡', label: 'Got It' },
                { emoji: '🔥', label: 'Awesome' },
              ].map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => handleSendReaction(item.emoji, item.label)}
                  className="p-2 rounded-xl hover:bg-slate-800 text-lg transition-transform hover:scale-125 cursor-pointer"
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 4. Text Input Field */}
        <div className="flex-1 min-w-0 bg-[#060A12] border border-slate-800 rounded-xl px-3 py-1.5 flex items-center gap-2 focus-within:border-violet-500/70 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
          <textarea
            id="question-input"
            rows={1}
            placeholder="Ask Prof. Gemini anything about physics..."
            value={inputText}
            onChange={(e) => updateInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading || isPlaying}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 resize-none focus:outline-none disabled:opacity-50 font-sans leading-relaxed pt-0.5"
          />
        </div>

        {/* 5. Voice Input Mic Button */}
        <button
          id="mic-btn"
          type="button"
          onClick={handleMicClick}
          title={isListening ? 'Stop Listening' : 'Voice Input'}
          className={`p-2 rounded-xl transition-all duration-200 shrink-0 cursor-pointer active:scale-95 ${
            isListening
              ? 'bg-red-600 text-white animate-pulse shadow-md shadow-red-600/40'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
          }`}
        >
          <Mic className={`w-4 h-4 ${isListening ? 'text-white' : 'text-slate-300'}`} />
        </button>

        {/* 6. Send Question Button */}
        <button
          id="ask-btn"
          type="button"
          onClick={handleSubmit}
          disabled={loading || isPlaying || !inputText.trim()}
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-mono font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shrink-0 shadow-md active:scale-95"
        >
          {loading ? (
            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Send className="w-3.5 h-3.5 text-white" />
          )}
          <span>Ask</span>
        </button>
      </div>

      {/* Playback Controls Row */}
      {chunks.length > 0 && (
        <div className="flex items-center gap-2 px-1">
          <button
            id="play-pause-btn"
            type="button"
            onClick={handlePlayPause}
            className="flex items-center gap-2 text-xs font-mono font-bold text-slate-300 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer shadow-sm"
          >
            {isPlaying && !isPaused ? (
              <>⏸ Pause</>
            ) : isPaused ? (
              <>▶ Resume</>
            ) : (
              <>▶ Play Lecture</>
            )}
          </button>
          {(isPlaying || isPaused) && (
            <button
              id="stop-btn"
              type="button"
              onClick={stop}
              className="flex items-center gap-2 text-xs font-mono font-bold text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all cursor-pointer shadow-sm"
            >
              ⏹ Stop
            </button>
          )}
        </div>
      )}
    </div>
  );
});

InputBar.displayName = 'InputBar';
