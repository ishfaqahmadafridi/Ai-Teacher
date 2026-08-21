'use client';
import { useAppSelector } from '@/hooks/useAppStore';
import { useClassroomApi } from '../hooks/useClassroomApi';
import { Sidebar, MobileSidebar } from './sidebar';
import { TopBar } from './topbar/TopBar';
import { ChalkboardStage } from './board/ChalkboardStage';
import { DiagramStage } from './board/diagram/DiagramStage';
import { TeacherFigure } from './teacher/TeacherFigure';
import { SubtitleBar } from './stage/SubtitleBar';
import { InputBar } from './input/InputBar';
import { useChunkPlayer } from '../hooks/useChunkPlayer';
import { useEffect } from 'react';

export function ClassroomLayout() {
  const loading = useAppSelector((s) => s.classroom.loading);
  const isPlaying = useAppSelector((s) => s.classroom.isPlaying);
  const chunks = useAppSelector((s) => s.classroom.chunks);
  const error = useAppSelector((s) => s.classroom.error);
  const loadingStatus = useAppSelector((s) => s.classroom.loadingStatus);
  const diagramType = useAppSelector((s) => s.classroom.diagramType);
  const currentCommand = useAppSelector((s) => s.classroom.currentCommand);
  const currentFormula = useAppSelector((s) => s.classroom.currentFormula);

  const { sendQuestion } = useClassroomApi();
  const { play } = useChunkPlayer();

  // Auto-play when chunks arrive
  useEffect(() => {
    if (chunks.length > 0 && !isPlaying) {
      play();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chunks]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-white font-sans">
      {/* Sidebar */}
      <Sidebar
        onAsk={sendQuestion}
        loading={loading}
        isPlaying={isPlaying}
      />

      {/* Mobile Sidebar */}
      <MobileSidebar
        onAsk={sendQuestion}
        loading={loading}
        isPlaying={isPlaying}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Top bar */}
        <TopBar />

        {/* Stage */}
        <main className="relative flex-1 overflow-hidden">
          {/* Background — classroom wall */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950">
            {/* Floor line */}
            <div className="absolute bottom-[17%] left-0 right-0 h-px bg-slate-800" />
          </div>

          {/* Chalkboard & Diagram Stage */}
          <div className="absolute top-6 left-8 right-8 bottom-[22%] flex gap-6">
            <div className={`h-full transition-all duration-500 ${diagramType !== 'default' ? 'w-[45%]' : 'w-full'}`}>
              <ChalkboardStage />
            </div>
            {diagramType !== 'default' && (
              <div className="w-[55%] h-full rounded-2xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm overflow-hidden relative shadow-lg">
                <DiagramStage
                  diagramType={diagramType}
                  command={currentCommand}
                  formula={currentFormula}
                />
              </div>
            )}
          </div>

          {/* Teacher */}
          <TeacherFigure />

          {/* Welcome overlay when idle */}
          {!loading && !isPlaying && chunks.length === 0 && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 pointer-events-none">
              <div className="text-6xl animate-bounce">🎓</div>
              <h2 className="text-2xl font-bold text-white/80">
                Welcome to Prof. Gemini&apos;s Classroom
              </h2>
              <p className="text-slate-400 text-base">
                Ask a physics question to start your lesson
              </p>
            </div>
          )}

          {/* Loading overlay */}
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm z-20">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 border-4 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
                  <span className="absolute inset-0 flex items-center justify-center text-2xl">
                    🧠
                  </span>
                </div>
                <p className="text-slate-300 text-sm max-w-xs text-center">
                  {loadingStatus || 'Preparing your lesson…'}
                </p>
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 bg-red-500/20 border border-red-500/40 rounded-xl px-5 py-3 text-red-300 text-sm text-center max-w-sm">
              {error}
            </div>
          )}

          {/* Subtitles */}
          <SubtitleBar />
        </main>

        {/* Input area */}
        <div className="shrink-0 border-t border-slate-800 bg-slate-900/80 backdrop-blur px-5 py-4">
          <InputBar />
        </div>
      </div>
    </div>
  );
}
