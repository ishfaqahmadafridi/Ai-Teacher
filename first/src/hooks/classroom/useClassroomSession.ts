import { useState, useRef, useCallback, useEffect } from 'react';
import { useChunkPlayer, type DiagramCommand } from './useChunkPlayer';
import { useVoiceInput } from './useVoiceInput';
import { useSpeechVoices } from './useSpeechVoices';
import { useClassroomApi } from './useClassroomApi';
import apiClient from '../../utils/apiClient';
import type { ExtendedChunk, TeachingResponse, Phase } from '../../types/classroom/classroom.types';

// Convert Phase[] -> Chunk[] for useChunkPlayer
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

export function useClassroomSession() {
  const sessionId = useRef(`s-${Date.now()}`);

  // ── Sub-hooks ─────────────────────────────────────────────────────────────
  const { voices, selectedVoice, setSelectedVoice } = useSpeechVoices();
  const {
    loading,
    loadingStatus,
    error,
    setError,
    topic,
    diagramType,
    fetchTeachingData,
    resetApiState,
  } = useClassroomApi();

  const { isPlaying, currentChunkIndex, spokenText, play, stop } = useChunkPlayer();
  const { transcript, isListening, error: voiceError, startListening, stopListening, resetTranscript } = useVoiceInput();

  // ── State ─────────────────────────────────────────────────────────────────
  const [inputText, setInputText]           = useState('');
  const [chunks, setChunks]                 = useState<ExtendedChunk[]>([]);
  const [currentCommand, setCurrentCommand] = useState<DiagramCommand | null>(null);
  const [currentFormula, setCurrentFormula] = useState<string | null>(null);
  const [chalkboardPoints, setChalkboardPoints] = useState<string[]>([]);
  const [teacherPosition, setTeacherPosition] = useState<'left' | 'right' | 'center'>('left');
  const [isWritingOnBoard, setIsWritingOnBoard] = useState(false);
  const [isPaused, setIsPaused]             = useState(false);

  // ── Live chalkboard: append one key_point at a time as each phase plays ──
  const handleKeyPoint = useCallback((point: string) => {
    setChalkboardPoints(prev => [...prev, point]);
    // Trigger writing gesture briefly
    setIsWritingOnBoard(true);
    setTimeout(() => setIsWritingOnBoard(false), 1800);
  }, []);

  // ── Sync voice transcript -> input box ────────────────────────────────────
  useEffect(() => {
    if (transcript) setInputText(transcript);
  }, [transcript]);

  // ── Track current spoken text, command, and teacher position ─────────────
  useEffect(() => {
    if (currentChunkIndex >= 0 && chunks[currentChunkIndex]) {
      const chunk = chunks[currentChunkIndex] as ExtendedChunk;
      setCurrentCommand(chunk.diagram ?? null);
      if (chunk.teacher_position) {
        setTeacherPosition(chunk.teacher_position);
      }
      if (chunk.diagram?.action === 'show_formula' || chunk.diagram?.action === 'show_formula_stepwise') {
        setCurrentFormula((chunk.diagram as any).formula ?? null);
      } else {
        setCurrentFormula(null);
      }
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
    const onStart = () => {
      handleStop();
      setCurrentCommand(null);
      setCurrentFormula(null);
      setInputText('');
      resetTranscript();
      setChalkboardPoints([]);
      setTeacherPosition('left');
    };

    const onSuccess = (teachingData: TeachingResponse) => {
      const newChunks = phasesToChunks(teachingData.phases);
      setChunks(newChunks);
      setChalkboardPoints([]);
      play(newChunks, handleDiagramCommand, selectedVoice || null, handleKeyPoint);
    };

    await fetchTeachingData(question, onStart, onSuccess);
  }, [selectedVoice, play, handleStop, handleDiagramCommand, handleKeyPoint, resetTranscript, fetchTeachingData]);

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
      setTimeout(() => { if (inputText.trim()) askQuestion(inputText); }, 600);
    } else {
      startListening();
    }
  };

  const handleNewSession = async () => {
    handleStop();
    setChunks([]);
    setCurrentCommand(null);
    setCurrentFormula(null);
    setChalkboardPoints([]);
    resetApiState();
    try { await apiClient.post('/clear/', { session_id: sessionId.current }); } catch {}
    sessionId.current = `s-${Date.now()}`;
  };

  const lectureMode = isPlaying || loading;

  return {
    inputText,
    setInputText,
    loading,
    loadingStatus,
    error,
    setError,
    chunks,
    diagramType,
    currentCommand,
    currentFormula,
    voices,
    selectedVoice,
    setSelectedVoice,
    chalkboardPoints,
    teacherPosition,
    isWritingOnBoard,
    isPaused,
    topic,
    isPlaying,
    currentChunkIndex,
    spokenText,
    isListening,
    voiceError,
    askQuestion,
    handleMicClick,
    handleNewSession,
    handlePause,
    handleStop,
    lectureMode,
  };
}
