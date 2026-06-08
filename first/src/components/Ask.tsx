import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import 'katex/dist/katex.min.css';
import apiClient from '../utils/apiClient';

// ─── Types ────────────────────────────────────────────────────────────────────
type Role = 'user' | 'assistant';
interface Message { id: string; role: Role; content: string; }
interface Voice { name: string; lang: string; uri?: string; }

// ─── Helpers ──────────────────────────────────────────────────────────────────
function genId() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function stripForSpeech(text: string): string {
  return text
    .replace(/<svg[\s\S]*?<\/svg>/gi, 'See the diagram on screen.')
    .replace(/\$\$[\s\S]*?\$\$/g, 'See the formula on screen.')
    .replace(/\$[^$]*?\$/g, 'See the formula on screen.')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]*`/g, '')
    .replace(/[#*_~>`|]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// ─── Suggestion chips ─────────────────────────────────────────────────────────
const SUGGESTIONS = [
  'What is work and energy?',
  'Explain Newton\'s Laws of Motion',
  'What is projectile motion?',
  'Explain electric field and force',
  'What is simple harmonic motion?',
  'Explain the law of conservation of momentum',
];

// ─── Main Component ───────────────────────────────────────────────────────────
export const Ask: React.FC = () => {
  const sessionId = useRef(`session-${genId()}`);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // TTS
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  // ── Load voices ────────────────────────────────────────────────────────────
  useEffect(() => {
    const synth = window.speechSynthesis;
    const load = () => {
      const v = synth.getVoices();
      const mapped = v.map(x => ({ name: x.name, lang: x.lang, uri: x.voiceURI }));
      setVoices(mapped);
      if (mapped.length > 0 && !selectedVoice)
        setSelectedVoice(mapped[0].uri ?? mapped[0].name);
    };
    load();
    synth.onvoiceschanged = load;
    return () => { synth.onvoiceschanged = null; };
  }, []);

  // ── Auto-scroll ────────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // ── Auto-speak new assistant messages ─────────────────────────────────────
  useEffect(() => {
    if (!autoSpeak || messages.length === 0) return;
    const last = messages[messages.length - 1];
    if (last.role === 'assistant') startSpeak(last.id, last.content);
  }, [messages]);

  // ── TTS ───────────────────────────────────────────────────────────────────
  const startSpeak = useCallback((id: string, content: string) => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const clean = stripForSpeech(content);
    const u = new SpeechSynthesisUtterance(clean);
    const all = synth.getVoices();
    const found = all.find(v => v.voiceURI === selectedVoice || v.name === selectedVoice);
    if (found) u.voice = found;
    u.lang = found?.lang ?? 'en-US';
    u.rate = 0.95;
    u.pitch = 1.05;
    u.onstart = () => setSpeakingId(id);
    u.onend = () => setSpeakingId(null);
    u.onerror = () => setSpeakingId(null);
    synth.speak(u);
  }, [selectedVoice]);

  const stopSpeak = useCallback(() => {
    window.speechSynthesis.cancel();
    setSpeakingId(null);
  }, []);

  const toggleSpeak = (id: string, content: string) => {
    if (speakingId === id) { stopSpeak(); return; }
    stopSpeak();
    startSpeak(id, content);
  };

  // ── Auto-resize textarea ──────────────────────────────────────────────────
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

  // ── Send message ──────────────────────────────────────────────────────────
  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    const userMsg: Message = { id: genId(), role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
    setLoading(true);
    try {
      const res = await apiClient.post('/ask/', {
        question: userMsg.content,
        session_id: sessionId.current,
      });
      setMessages(prev => [...prev, {
        id: genId(), role: 'assistant',
        content: res.data.answer ?? JSON.stringify(res.data),
      }]);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? err.message ?? 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); sendMessage(input); };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  // ── New session ────────────────────────────────────────────────────────────
  const handleNewChat = async () => {
    stopSpeak();
    setMessages([]);
    setError(null);
    try { await apiClient.post('/clear/', { session_id: sessionId.current }); } catch {}
    sessionId.current = `session-${genId()}`;
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-white/[0.07]"
      style={{ background: 'linear-gradient(160deg, rgba(15,23,42,0.97) 0%, rgba(9,18,36,0.99) 100%)' }}>

      {/* ── Sidebar + Chat layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left sidebar ── */}
        <aside className="hidden md:flex flex-col w-64 border-r border-white/[0.06] bg-black/20 p-4 gap-3 flex-shrink-0">
          {/* Professor card */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600/20 to-indigo-700/20 border border-blue-500/20 p-4 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <p className="font-bold text-white text-sm">Prof. Gemini</p>
            <p className="text-xs text-blue-300/80 mt-0.5">Physics Professor</p>
            <div className="flex items-center justify-center gap-1.5 mt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Online</span>
            </div>
          </div>

          {/* Topic suggestions */}
          <div>
            <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">Suggested Topics</p>
            <div className="flex flex-col gap-1.5">
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => sendMessage(s)}
                  className="text-left text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl hover:bg-white/10 transition-all border border-transparent hover:border-white/10 leading-snug">
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* New chat */}
          <div className="mt-auto">
            <button onClick={handleNewChat}
              className="w-full py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all border border-blue-500/30 shadow-md">
              + New Session
            </button>
          </div>
        </aside>

        {/* ── Main chat panel ── */}
        <div className="flex flex-col flex-1 overflow-hidden">

          {/* Chat header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] bg-black/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">Prof. Gemini</p>
                <p className="text-[11px] text-slate-400 mt-0.5">College Physics 2e · Active</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select value={selectedVoice ?? ''} onChange={e => setSelectedVoice(e.target.value)}
                className="text-xs text-slate-300 bg-transparent border-b border-white/10 outline-none max-w-[100px] truncate py-1">
                {voices.map(v => (
                  <option key={v.uri ?? v.name} value={v.uri ?? v.name} className="bg-slate-900">{v.name}</option>
                ))}
              </select>
              <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                <input type="checkbox" checked={autoSpeak} onChange={e => setAutoSpeak(e.target.checked)} className="accent-blue-500" />
                <span>Auto-speak</span>
              </label>
              <button onClick={handleNewChat} className="md:hidden text-xs px-2.5 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white">
                New Chat
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8">
            {/* Welcome screen */}
            {messages.length === 0 && !loading && (
              <div className="flex flex-col items-center justify-center h-full text-center gap-6 py-12">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">Welcome to Physics Class</h2>
                  <p className="text-slate-400 max-w-md leading-relaxed text-sm">
                    Ask Prof. Gemini any physics question. You'll get structured explanations with real examples, visual diagrams, step-by-step formulas, and a diagnostic question to check your understanding.
                  </p>
                </div>
                {/* Mobile chips */}
                <div className="md:hidden flex flex-wrap gap-2 justify-center max-w-sm">
                  {SUGGESTIONS.slice(0, 4).map(s => (
                    <button key={s} onClick={() => sendMessage(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all">
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold shadow-md mt-1
                  ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-violet-500 to-purple-600 text-white'
                    : 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white'}`}>
                  {msg.role === 'user' ? 'Y' : 'P'}
                </div>

                <div className={`flex flex-col gap-2 max-w-[88%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                  {/* Bubble */}
                  <div className={`relative group px-5 py-4 rounded-2xl shadow-lg
                    ${msg.role === 'user'
                      ? 'bg-gradient-to-br from-violet-600/70 to-purple-700/70 border border-purple-500/30 text-white rounded-tr-sm text-sm'
                      : 'bg-slate-800/60 backdrop-blur border border-white/[0.08] text-slate-100 rounded-tl-sm'}`}>

                    {msg.role === 'assistant' ? (
                      <div className="
                        prose prose-invert prose-sm max-w-none
                        prose-h3:text-blue-300 prose-h3:font-bold prose-h3:text-base prose-h3:mt-5 prose-h3:mb-2
                        prose-h2:text-white prose-h2:text-lg
                        prose-p:text-slate-200 prose-p:leading-relaxed prose-p:my-1.5
                        prose-li:text-slate-200 prose-li:my-1
                        prose-strong:text-white prose-strong:font-semibold
                        prose-code:text-emerald-300 prose-code:bg-emerald-500/10 prose-code:px-1 prose-code:rounded
                        prose-pre:bg-black/40 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                        prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-500/10 prose-blockquote:rounded-r-lg prose-blockquote:py-0.5
                        prose-hr:border-white/10
                        [&_.katex]:text-yellow-300 [&_.katex-display]:my-4 [&_.katex-display]:overflow-x-auto
                        [&_svg]:max-w-full [&_svg]:mx-auto [&_svg]:block [&_svg]:my-4
                      ">
                        <ReactMarkdown
                          remarkPlugins={[remarkMath]}
                          rehypePlugins={[rehypeKatex, rehypeRaw]}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    )}
                  </div>

                  {/* Action row under assistant messages */}
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 px-1">
                      <button onClick={() => toggleSpeak(msg.id, msg.content)}
                        className={`flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border transition-all
                          ${speakingId === msg.id
                            ? 'bg-red-500/20 border-red-500/40 text-red-400'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'}`}>
                        {speakingId === msg.id ? (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                            Stop
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M12 6v12m-4.5-9l4.5-4.5 4.5 4.5" /></svg>
                            Listen
                          </>
                        )}
                      </button>
                      <button onClick={() => sendMessage("I don't understand, please explain differently.")}
                        className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border border-white/10 text-slate-400 hover:text-white hover:border-white/20 bg-white/5 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                        Different analogy
                      </button>
                      <button onClick={() => sendMessage("Yes, I understood! Please continue.")}
                        className="flex items-center gap-1.5 text-[11px] px-3 py-1 rounded-full border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 bg-white/5 transition-all">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Got it, continue!
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-md flex-shrink-0">P</div>
                <div className="bg-slate-800/60 border border-white/[0.08] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {[0, 150, 300].map(d => (
                      <div key={d} className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                  <span className="text-xs text-slate-500 ml-1">Professor is thinking...</span>
                </div>
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="flex justify-center">
                <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm max-w-lg text-center">
                  <strong>⚠️ Error:</strong> {error}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* ── Input bar ── */}
          <div className="flex-shrink-0 border-t border-white/[0.06] bg-black/20 px-4 md:px-6 py-4">
            <form onSubmit={handleSubmit} className="flex items-end gap-3">
              <div className="relative flex-1">
                {/* glow ring on focus */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-blue-500/30 to-purple-500/30 opacity-0 peer-focus:opacity-100 transition-opacity pointer-events-none" />
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={e => { setInput(e.target.value); resizeTextarea(); }}
                  onKeyDown={handleKeyDown}
                  rows={1}
                  placeholder="Ask your professor… (Enter to send, Shift+Enter for new line)"
                  className="peer w-full px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500
                    bg-slate-900/70 border border-white/[0.08] focus:border-blue-500/50 outline-none
                    resize-none transition-all leading-relaxed max-h-40 overflow-y-auto"
                  style={{ minHeight: '52px' }}
                />
              </div>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex-shrink-0 w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600
                  hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/40
                  hover:shadow-blue-700/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                  flex items-center justify-center"
              >
                {loading ? (
                  <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
            <p className="text-[11px] text-slate-600 mt-2 text-center">
              Enter to send · Shift+Enter for new line · Powered by Gemini Flash
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Ask;
