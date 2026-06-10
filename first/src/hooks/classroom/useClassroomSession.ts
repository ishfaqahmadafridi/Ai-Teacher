import { useRef, useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  setInputText,
  setChunks,
  setCurrentCommand,
  setCurrentFormula,
  addChalkboardPoint,
  clearChalkboardPoints,
  setTeacherPosition,
  setIsWritingOnBoard,
  setIsPaused,
} from '../../redux/classroomSlice';
import { useChunkPlayer } from './useChunkPlayer';
import { useVoiceInput } from './useVoiceInput';
import { useSpeechVoices } from './useSpeechVoices';
import { useClassroomApi } from './useClassroomApi';
import apiClient from '../../utils/apiClient';
import type {
  ExtendedChunk,
  TeachingResponse,
  Phase,
  DiagramCommand,
} from '../../types/classroom/classroom.types';

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
  const dispatch = useAppDispatch();

  // ── Redux state selectors ─────────────────────────────────────────────────
  const inputText = useAppSelector(state => state.classroom.inputText);
  const chunks = useAppSelector(state => state.classroom.chunks);
  const currentCommand = useAppSelector(state => state.classroom.currentCommand);
  const currentFormula = useAppSelector(state => state.classroom.currentFormula);
  const chalkboardPoints = useAppSelector(state => state.classroom.chalkboardPoints);
  const teacherPosition = useAppSelector(state => state.classroom.teacherPosition);
  const isWritingOnBoard = useAppSelector(state => state.classroom.isWritingOnBoard);
  const isPaused = useAppSelector(state => state.classroom.isPaused);

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

  // ── Live chalkboard: append one key_point at a time as each phase plays ──
  const handleKeyPoint = useCallback((point: string) => {
    dispatch(addChalkboardPoint(point));
    // Trigger writing gesture briefly
    dispatch(setIsWritingOnBoard(true));
    setTimeout(() => dispatch(setIsWritingOnBoard(false)), 1800);
  }, [dispatch]);

  // ── Sync voice transcript -> input box ────────────────────────────────────
  useEffect(() => {
    if (transcript) dispatch(setInputText(transcript));
  }, [transcript, dispatch]);

  // ── Track current spoken text, command, and teacher position ─────────────
  useEffect(() => {
    if (currentChunkIndex >= 0 && chunks[currentChunkIndex]) {
      const chunk = chunks[currentChunkIndex] as ExtendedChunk;
      dispatch(setCurrentCommand(chunk.diagram ?? null));
      if (chunk.teacher_position) {
        dispatch(setTeacherPosition(chunk.teacher_position));
      }
      if (chunk.diagram?.action === 'show_formula' || chunk.diagram?.action === 'show_formula_stepwise') {
        dispatch(setCurrentFormula((chunk.diagram as any).formula ?? null));
      } else {
        dispatch(setCurrentFormula(null));
      }
    }
  }, [currentChunkIndex, chunks, dispatch]);

  // ── Handle diagram command from chunk player ──────────────────────────────
  const handleDiagramCommand = useCallback((cmd: DiagramCommand) => {
    dispatch(setCurrentCommand(cmd));
    if ((cmd.action === 'show_formula' || cmd.action === 'show_formula_stepwise') && (cmd as any).formula) {
      dispatch(setCurrentFormula((cmd as any).formula));
    } else {
      dispatch(setCurrentFormula(null));
    }
  }, [dispatch]);

  // ── Pause / Resume ────────────────────────────────────────────────────────
  const handlePause = useCallback(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      if (isPaused) {
        window.speechSynthesis.resume();
        dispatch(setIsPaused(false));
      } else {
        window.speechSynthesis.pause();
        dispatch(setIsPaused(true));
      }
    }
  }, [isPaused, dispatch]);

  // ── Stop and exit lecture mode ────────────────────────────────────────────
  const handleStop = useCallback(() => {
    stop();
    dispatch(setIsPaused(false));
    dispatch(setTeacherPosition('left'));
  }, [stop, dispatch]);

  // ── MAIN: Submit question via SSE ─────────────────────────────────────────
  const askQuestion = useCallback(async (question: string) => {
    const onStart = () => {
      handleStop();
      dispatch(setCurrentCommand(null));
      dispatch(setCurrentFormula(null));
      dispatch(setInputText(''));
      resetTranscript();
      dispatch(clearChalkboardPoints());
      dispatch(setTeacherPosition('left'));
    };

    const onSuccess = (teachingData: TeachingResponse) => {
      const newChunks = phasesToChunks(teachingData.phases);
      dispatch(setChunks(newChunks));
      dispatch(clearChalkboardPoints());
      play(newChunks, handleDiagramCommand, selectedVoice || null, handleKeyPoint);
    };

    await fetchTeachingData(question, onStart, onSuccess);
  }, [selectedVoice, play, handleStop, handleDiagramCommand, handleKeyPoint, resetTranscript, fetchTeachingData, dispatch]);

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
    dispatch(setChunks([]));
    dispatch(setCurrentCommand(null));
    dispatch(setCurrentFormula(null));
    dispatch(clearChalkboardPoints());
    resetApiState();
    try { await apiClient.post('/clear/', { session_id: sessionId.current }); } catch {}
    sessionId.current = `s-${Date.now()}`;
  };

  const lectureMode = isPlaying || loading;

  return {
    inputText,
    setInputText: (val: string) => dispatch(setInputText(val)),
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
