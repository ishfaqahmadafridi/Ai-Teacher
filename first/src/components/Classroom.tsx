/**
 * Classroom.tsx
 * The main classroom component -- the heart of the AI Physics Teacher.
 *
 * LECTURE MODE (new):
 *   When isPlaying = true, the UI switches to full-screen "lecture mode":
 *     - Left sidebar HIDES
 *     - Input bar HIDES
 *     - Board takes up the entire viewport
 *     - Animated teacher figure walks left/right at the bottom
 *     - Live chalk key-points write themselves on the board as teacher speaks
 *     - Only a floating Stop + Pause button is shown
 *
 * Flow:
 *   1. Student types or speaks a question.
 *   2. POST /api/physics-teacher/explain/ -> receives SSE stream from Gemini.
 *   3. SSE events: {status:"thinking"} -> {result:{...phases...}} -> [DONE]
 *   4. useChunkPlayer plays each phase: fires diagram command -> speaks text.
 *   5. 3D diagram updates in sync with the professor's voice.
 *   6. Student sees subtitle + teacher walking + chalk key points.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';
import DiagramStage, { type DiagramType } from './DiagramStage';
import SubtitleBar from './SubtitleBar';
import TeacherFigure from './TeacherFigure';
import ChalkText from './ChalkText';
import { useChunkPlayer, type Chunk, type DiagramCommand } from '../hooks/useChunkPlayer';
import { useVoiceInput } from '../hooks/useVoiceInput';
import apiClient from '../utils/apiClient';

// ── Suggested questions shown on the welcome screen ───────────────────────────
const SUGGESTIONS = [
  'What is gravity and why does it exist?',
  "Explain Newton's Laws of Motion",
  'What is projectile motion?',
  'How does electric current work?',
  'What is simple harmonic motion?',
  'Explain the law of conservation of energy',
  'What is the Doppler effect?',
  'How do waves transfer energy?',
];

// ── Voice list helper ─────────────────────────────────────────────────────────
function getVoices(): SpeechSynthesisVoice[] {
  return window.speechSynthesis?.getVoices() ?? [];
}

// ── Phase type (from backend) ─────────────────────────────────────────────────
interface Phase {
  phase: number;
  name: string;
  diagram_action: string;
  diagram_target?: string;
  speak: string;
  key_point?: string | null;
  joke?: string | null;
  animate?: { object: string; move: string; speed: string };
  formulas?: { line: number; speak: string; display: string }[];
  wait_for_answer?: boolean;
  annotation?: string;
  annotation_position?: string;
  teacher_position?: 'left' | 'right' | 'center';
}

interface TeachingResponse {
  topic: string;
  language: string;
  diagram_type: string;
  phases: Phase[];
}

// ── Extend Chunk to carry teacher_position ────────────────────────────────────
interface ExtendedChunk extends Chunk {
  teacher_position?: 'left' | 'right' | 'center';
}

// ── Convert Phase[] -> Chunk[] for useChunkPlayer ────────────────────────────
function phasesToChunks(phases: Phase[]): ExtendedChunk[] {
  return phases.map((p): ExtendedChunk => {
    let speakText = p.speak ?? '';
    if (p.diagram_action === 'show_formula_stepwise' && p.formulas?.length) {
      speakText = p.formulas.map(f => f.speak).join('. ');
    }

    let diagram: DiagramCommand | undefined;
    if (p.diagram_action && p.diagram_action !== 'none') {
      diagram = {
        action: p.diagram_action as DiagramCommand['action'],
        target: p.diagram_target,
        formula:
          p.diagram_action === 'show_formula_stepwise' && p.formulas?.[0]
            ? p.formulas[0].display
            : undefined,
        animate: p.animate,
        annotation: p.annotation,
        annotation_position: p.annotation_position,
      } as DiagramCommand;
    }

    return {
      speak: speakText,
      diagram,
      key_point: p.key_point,
      teacher_position: p.teacher_position ?? 'left',
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Classroom() {
  const sessionId = useRef(`s-${Date.now()}`);

  // ── State ─────────────────────────────────────────────────────────────────
  const [inputText, setInputText]           = useState('');
  const [loading, setLoading]               = useState(false);
  const [loadingStatus, setLoadingStatus]   = useState('Thinking…');
  const [error, setError]                   = useState<string | null>(null);
  const [chunks, setChunks]                 = useState<ExtendedChunk[]>([]);
  const [diagramType, setDiagramType]       = useState<DiagramType>('default');
  const [currentCommand, setCurrentCommand] = useState<DiagramCommand | null>(null);
  const [currentFormula, setCurrentFormula] = useState<string | null>(null);
  const [currentSpeak, setCurrentSpeak]     = useState('');
  const [voices, setVoices]                 = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice]   = useState<string>('');
  const [_history, setHistory]              = useState<{ role: 'user' | 'prof'; text: string }[]>([]);
  const [chalkboardPoints, setChalkboardPoints] = useState<string[]>([]);
  const [teacherPosition, setTeacherPosition] = useState<'left' | 'right' | 'center'>('left');
  const [isWritingOnBoard, setIsWritingOnBoard] = useState(false);
  const [isPaused, setIsPaused]             = useState(false);
  const [topic, setTopic]                   = useState('');

  // ── Live chalkboard: append one key_point at a time as each phase plays ──
  const handleKeyPoint = useCallback((point: string) => {
    setChalkboardPoints(prev => [...prev, point]);
    // Trigger writing gesture briefly
    setIsWritingOnBoard(true);
    setTimeout(() => setIsWritingOnBoard(false), 1800);
  }, []);

  // ── Hooks ─────────────────────────────────────────────────────────────────
  const { isPlaying, currentChunkIndex, play, stop } = useChunkPlayer();
  const { transcript, isListening, error: voiceError, startListening, stopListening, resetTranscript } = useVoiceInput();

  const textareaRef   = useRef<HTMLTextAreaElement>(null);
  const sseAbortRef   = useRef<AbortController | null>(null);

  // ── Load voices ─────────────────────────────────────────────────────────
  useEffect(() => {
    const load = () => {
      const v = getVoices();
      setVoices(v);
      if (v.length > 0 && !selectedVoice) {
        const preferred = v.find(x => x.lang.startsWith('en') && x.localService) ?? v[0];
        setSelectedVoice(preferred?.voiceURI ?? preferred?.name ?? '');
      }
    };
    load();
    window.speechSynthesis.onvoiceschanged = load;
    return () => { window.speechSynthesis.onvoiceschanged = null; };
  }, []);

  // ── Sync voice transcript -> input box ────────────────────────────────────
  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  // ── Track current spoken text, command, and teacher position ─────────────
  useEffect(() => {
    if (currentChunkIndex >= 0 && chunks[currentChunkIndex]) {
      const chunk = chunks[currentChunkIndex] as ExtendedChunk;
      setCurrentSpeak(chunk.speak);
      setCurrentCommand(chunk.diagram ?? null);
      if (chunk.teacher_position) {
        setTeacherPosition(chunk.teacher_position);
      }
      if (chunk.diagram?.action === 'show_formula' || chunk.diagram?.action === 'show_formula_stepwise') {
        setCurrentFormula((chunk.diagram as any).formula ?? null);
      } else {
        setCurrentFormula(null);
      }
    } else {
      setCurrentSpeak('');
    }
  }, [currentChunkIndex, chunks]);

  // ── Handle diagram command from chunk player ──────────────────────────────
  const handleDiagramCommand = useCallback((cmd: DiagramCommand) => {
    setCurrentCommand(cmd);
    if ((cmd.action === 'show_formula' || cmd.action === 'show_formula_stepwise') && (cmd as any).formula) {
      setCurrentFormula((cmd as any).formula);
    } else {
      setCurrentFormula(null);
    }
  }, []);

  // ── Auto-resize textarea ──────────────────────────────────────────────────
  const resizeTextarea = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  // ── Pause / Resume ────────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  }, [isPaused]);

  // ── Stop and exit lecture mode ────────────────────────────────────────────
  const handleStop = useCallback(() => {
    stop();
    setIsPaused(false);
    setTeacherPosition('left');
  }, [stop]);

  // ── MAIN: Submit question via SSE ─────────────────────────────────────────
  const askQuestion = useCallback(async (question: string) => {
    const q = question.trim();
    if (!q || loading) return;

    if (sseAbortRef.current) sseAbortRef.current.abort();

    setError(null);
    setLoading(true);
    setLoadingStatus('Connecting to Prof. Gemini…');
    handleStop();
    setCurrentCommand(null);
    setCurrentFormula(null);
    setInputText('');
    resetTranscript();
    setChalkboardPoints([]);
    setTeacherPosition('left');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    setHistory(prev => [...prev, { role: 'user', text: q }]);

    try {
      const controller = new AbortController();
      sseAbortRef.current = controller;

      const response = await fetch('/api/physics-teacher/explain/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, language: 'en' }),
        signal: controller.signal,
      });

      if (!response.ok) throw new Error(`Server error ${response.status}: ${response.statusText}`);
      if (!response.body) throw new Error('No response body received from server');

      setLoadingStatus('Prof. Gemini is thinking…');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let teachingData: TeachingResponse | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;

          const rawData = trimmed.slice(5).trim();
          if (rawData === '[DONE]') break;

          try {
            const parsed = JSON.parse(rawData);
            if (parsed.status === 'thinking') {
              setLoadingStatus('Prof. Gemini is preparing your lesson…');
            } else if (parsed.error) {
              throw new Error(parsed.error);
            } else if (parsed.result) {
              teachingData = parsed.result as TeachingResponse;
            }
          } catch {
            // Partial SSE line -- ignore
          }
        }
      }

      if (!teachingData) throw new Error('No teaching data received from Prof. Gemini');

      const newChunks = phasesToChunks(teachingData.phases);
      const newDiagramType = (teachingData.diagram_type ?? 'default') as DiagramType;

      setChunks(newChunks);
      setDiagramType(newDiagramType);
      setTopic(teachingData.topic ?? '');
      setChalkboardPoints([]);

      const summary = teachingData.phases.map(p => p.speak).filter(Boolean).join(' ');
      setHistory(prev => [...prev, { role: 'prof', text: summary }]);

      play(newChunks, handleDiagramCommand, selectedVoice || null, handleKeyPoint);

    } catch (err: any) {
      if (err?.name === 'AbortError') return;
      setError(err?.message ?? 'Request failed. Please try again.');
    } finally {
      setLoading(false);
      setLoadingStatus('Thinking…');
      sseAbortRef.current = null;
    }
  }, [loading, selectedVoice, play, handleStop, handleDiagramCommand, handleKeyPoint, resetTranscript]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    askQuestion(inputText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion(inputText);
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setTimeout(() => { if (inputText.trim()) askQuestion(inputText); }, 600);
    } else {
      startListening();
    }
  };

  const handleNewSession = async () => {
    if (sseAbortRef.current) sseAbortRef.current.abort();
    handleStop();
    setChunks([]);
    setHistory([]);
    setError(null);
    setCurrentCommand(null);
    setCurrentFormula(null);
    setCurrentSpeak('');
    setChalkboardPoints([]);
    setTopic('');
    try { await apiClient.post('/clear/', { session_id: sessionId.current }); } catch {}
    sessionId.current = `s-${Date.now()}`;
  };

  // ─── Lecture mode = isPlaying or loading (board takes full screen) ────────
  const lectureMode = isPlaying || loading;

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      className="flex h-[calc(100vh-80px)] rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl transition-all duration-700"
      style={{ background: 'linear-gradient(160deg,rgba(9,18,36,0.98) 0%,rgba(6,11,20,0.99) 100%)' }}
    >

      {/* ══════════════════════════════════════════════════════════════════════
          LEFT SIDEBAR — hidden in lecture mode
      ══════════════════════════════════════════════════════════════════════ */}
      <aside
        className={`flex-col w-64 xl:w-72 border-r border-white/[0.06] bg-black/20 p-4 gap-4 flex-shrink-0
          transition-all duration-500 overflow-hidden
          ${lectureMode ? 'hidden' : 'hidden lg:flex'}`}
      >
        {/* Professor card */}
        <div className="rounded-2xl p-4 text-center bg-gradient-to-br from-blue-600/15 to-indigo-700/15 border border-blue-500/20">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="font-bold text-white">Prof. Gemini</p>
          <p className="text-xs text-blue-300/80 mt-0.5">University Physics</p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className={`w-1.5 h-1.5 rounded-full ${loading ? 'bg-amber-400 animate-pulse' : isPlaying ? 'bg-yellow-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`} />
            <span className={`text-xs ${loading ? 'text-amber-400' : isPlaying ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {loading ? loadingStatus : isPlaying ? 'Teaching…' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Voice selector */}
        <div className="rounded-xl bg-white/5 border border-white/[0.08] p-3">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2">Professor Voice</p>
          <select
            value={selectedVoice}
            onChange={e => setSelectedVoice(e.target.value)}
            className="w-full text-xs text-slate-200 bg-transparent outline-none cursor-pointer"
          >
            {voices.map(v => (
              <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-white">
                {v.name}
              </option>
            ))}
          </select>
        </div>

        {/* Topic suggestions */}
        <div className="flex-1 min-h-0 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-2 px-1">Ask About…</p>
          <div className="flex flex-col gap-1.5">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => askQuestion(s)}
                disabled={loading || isPlaying}
                className="text-left text-xs text-slate-300 hover:text-white px-3 py-2 rounded-xl
                  hover:bg-white/10 border border-transparent hover:border-white/10
                  transition-all leading-snug disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleNewSession}
            className="w-full py-2 text-sm font-semibold text-white
              bg-gradient-to-r from-blue-600/80 to-indigo-600/80
              hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all
              border border-blue-500/30"
          >
            + New Session
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════════════════════════════════════
          MAIN STAGE — full board in lecture mode
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* ── Top bar ── */}
        <div
          className={`flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0 transition-all duration-500
            ${lectureMode
              ? 'bg-black/40 backdrop-blur-sm'
              : 'bg-black/10'}`}
        >
          <div className="flex items-center gap-2">
            {/* Topic pill */}
            {topic && (
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium capitalize">
                {topic.replace(/_/g, ' ')}
              </span>
            )}
            {!topic && diagramType !== 'default' && (
              <span className="text-xs px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium capitalize">
                {diagramType.replace('_', ' ')}
              </span>
            )}

            {/* Loading spinner */}
            {loading && (
              <span className="text-xs text-slate-400 flex items-center gap-1.5">
                <svg className="animate-spin w-3.5 h-3.5 text-blue-400" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                {loadingStatus}
              </span>
            )}
          </div>

          {/* Right side: lecture mode controls OR normal controls */}
          <div className="flex items-center gap-2">
            {/* Phase progress dots */}
            {isPlaying && chunks.length > 0 && (
              <div className="hidden sm:flex items-center gap-1.5">
                {chunks.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentChunkIndex
                        ? 'w-4 h-2 bg-blue-400'
                        : i < currentChunkIndex
                        ? 'w-2 h-2 bg-blue-600/60'
                        : 'w-2 h-2 bg-white/10'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* LECTURE MODE: floating pause + stop */}
            {isPlaying && (
              <>
                <button
                  onClick={handlePause}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all font-medium
                    ${isPaused
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30'
                      : 'bg-amber-500/20 border-amber-500/40 text-amber-300 hover:bg-amber-500/30'}`}
                >
                  {isPaused ? (
                    <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Resume</>
                  ) : (
                    <><svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/></svg>Pause</>
                  )}
                </button>
                <button
                  onClick={handleStop}
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-600 text-white border border-red-500/40 transition-all font-medium"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/></svg>
                  Stop
                </button>
              </>
            )}

            {/* Normal mode: new session + voice (non-lecture) */}
            {!lectureMode && (
              <>
                <div className="hidden lg:block rounded-lg bg-white/5 border border-white/[0.08] px-2 py-1">
                  <select
                    value={selectedVoice}
                    onChange={e => setSelectedVoice(e.target.value)}
                    className="text-xs text-slate-300 bg-transparent outline-none cursor-pointer max-w-[130px]"
                  >
                    {voices.map(v => (
                      <option key={v.voiceURI} value={v.voiceURI} className="bg-slate-900 text-white">{v.name}</option>
                    ))}
                  </select>
                </div>
                <button onClick={handleNewSession} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all">
                  New Chat
                </button>
              </>
            )}
            {lectureMode && !isPlaying && (
              <button onClick={handleNewSession} className="text-xs px-3 py-1.5 rounded-lg bg-white/10 border border-white/10 text-white hover:bg-white/20 transition-all">
                New Chat
              </button>
            )}
          </div>
        </div>

        {/* ── Board area ── */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* 3D Diagram + Teacher + Chalk overlay */}
          <div
            className="relative flex-1 min-h-0 transition-all duration-700"
            style={{
              background: lectureMode
                ? 'linear-gradient(160deg, #0a1628 0%, #050c18 100%)'
                : 'transparent',
            }}
          >
            {/* Subtle chalkboard texture overlay in lecture mode */}
            {lectureMode && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    radial-gradient(ellipse at 20% 20%, rgba(59,130,246,0.04) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 80%, rgba(99,102,241,0.03) 0%, transparent 60%)
                  `,
                }}
              />
            )}

            {/* Welcome overlay */}
            {chunks.length === 0 && !loading && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 px-6 text-center">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/20 to-indigo-600/20 border border-blue-500/20 flex items-center justify-center">
                  <svg className="w-12 h-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white mb-2">Welcome to Physics Class</h2>
                  <p className="text-slate-400 max-w-sm text-sm leading-relaxed">
                    Ask Prof. Gemini any physics question. The board will come alive with
                    animations, diagrams, and live explanations as the professor teaches.
                  </p>
                </div>
                {/* Mobile chips */}
                <div className="lg:hidden flex flex-wrap gap-2 justify-center max-w-sm">
                  {SUGGESTIONS.slice(0, 4).map(s => (
                    <button
                      key={s}
                      onClick={() => askQuestion(s)}
                      className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 transition-all"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading overlay */}
            {loading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-blue-500/30 animate-ping" />
                    <div className="absolute inset-2 rounded-full border-2 border-blue-400/50 animate-ping" style={{ animationDelay: '150ms' }} />
                    <div className="absolute inset-4 rounded-full bg-blue-500/20 border border-blue-400 flex items-center justify-center">
                      <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-white font-semibold text-sm">{loadingStatus}</p>
                  <p className="text-slate-400 text-xs">Retrieving from College Physics 2e…</p>
                </div>
              </div>
            )}

            {/* 3D Diagram -- always rendered, takes full space */}
            <DiagramStage
              diagramType={diagramType}
              command={currentCommand}
              formula={currentFormula}
            />

            {/* Live chalk key-points on board -- top-left corner */}
            <ChalkText
              points={chalkboardPoints}
              isPlaying={isPlaying}
            />

            {/* Subtitle bar -- just above teacher, bottom of board */}
            <SubtitleBar
              text={currentSpeak}
              isPlaying={isPlaying}
              chunkIndex={currentChunkIndex}
            />

            {/* Animated teacher figure at bottom */}
            <TeacherFigure
              position={teacherPosition}
              isPlaying={isPlaying}
              isWriting={isWritingOnBoard}
            />
          </div>

          {/* Key points side panel (only in non-lecture / non-playing mode) */}
          {!isPlaying && chalkboardPoints.length > 0 && (
            <div className="hidden xl:flex flex-col w-64 border-l border-white/[0.06] flex-shrink-0"
              style={{ background: 'linear-gradient(160deg, #1a2a1a 0%, #0f1f0f 100%)' }}>
              <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Key Points</span>
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {chalkboardPoints.map((point, i) => (
                  <div key={i} className="flex gap-2 items-start"
                    style={{ fontFamily: "'Caveat', cursive" }}>
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40
                      flex items-center justify-center text-[10px] font-bold text-emerald-400">
                      {i + 1}
                    </span>
                    <p className="text-sm text-emerald-100/80 leading-relaxed">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Error bar ── */}
        {error && (
          <div className="flex-shrink-0 mx-4 mb-1 px-4 py-2.5 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.834-1.732-.834-2.464 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
            </svg>
            {error}
            <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-white">✕</button>
          </div>
        )}

        {/* ── Voice error bar ── */}
        {voiceError && (
          <div className="flex-shrink-0 mx-4 mb-1 px-4 py-2 bg-orange-500/10 border border-orange-500/30 rounded-xl text-orange-300 text-xs">
            🎤 {voiceError}
          </div>
        )}

        {/* ── Input bar -- hidden in lecture mode ── */}
        <div
          className={`flex-shrink-0 border-t border-white/[0.06] bg-black/20 px-4 py-4 transition-all duration-500 ${
            lectureMode ? 'hidden' : 'block'
          }`}
        >
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            {/* Mic button */}
            <button
              type="button"
              onClick={handleMicClick}
              className={`flex-shrink-0 w-12 h-12 rounded-2xl border transition-all flex items-center justify-center shadow-md
                ${isListening
                  ? 'bg-red-500/80 border-red-500/60 shadow-red-900/40 animate-pulse'
                  : 'bg-white/10 border-white/10 hover:bg-white/20 hover:border-white/20'
                }`}
            >
              <svg className={`w-5 h-5 ${isListening ? 'text-white' : 'text-slate-300'}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Text input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={inputText}
                onChange={e => { setInputText(e.target.value); resizeTextarea(); }}
                onKeyDown={handleKeyDown}
                rows={1}
                placeholder={isListening ? '🎤 Listening… speak your question' : 'Ask your professor… (Enter to send)'}
                className="w-full px-4 py-3.5 rounded-2xl text-sm text-white placeholder-slate-500
                  bg-slate-900/70 border border-white/[0.08] focus:border-blue-500/50 outline-none
                  resize-none transition-all leading-relaxed max-h-32 overflow-y-auto"
                style={{ minHeight: '52px' }}
              />
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={loading || !inputText.trim()}
              className="flex-shrink-0 w-12 h-12 rounded-2xl
                bg-gradient-to-br from-blue-600 to-indigo-600
                hover:from-blue-500 hover:to-indigo-500
                shadow-lg shadow-blue-900/40 hover:shadow-blue-700/50
                transition-all disabled:opacity-30 disabled:cursor-not-allowed
                flex items-center justify-center"
            >
              {loading ? (
                <svg className="animate-spin w-5 h-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              ) : (
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                </svg>
              )}
            </button>
          </form>

          <p className="text-[11px] text-slate-600 mt-2 text-center">
            Enter to send · Shift+Enter for new line · 🎤 mic for voice · RAG-powered by College Physics 2e
          </p>
        </div>
      </div>
    </div>
  );
}
