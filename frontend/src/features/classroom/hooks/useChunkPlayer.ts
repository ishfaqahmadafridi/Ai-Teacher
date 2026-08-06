'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/useAppStore';
import {
  setIsPlaying,
  setCurrentChunkIndex,
  setSpokenText,
  setCurrentCommand,
  setCurrentFormula,
  setTeacherPosition,
  setIsWritingOnBoard,
  addChalkboardPoint,
  setIsPaused,
} from '@/features/classroom/state/classroomSlice';

export function useChunkPlayer() {
  const dispatch = useAppDispatch();
  const chunks = useAppSelector((s) => s.classroom.chunks);
  const selectedVoice = useAppSelector((s) => s.classroom.selectedVoice);
  const voices = useAppSelector((s) => s.classroom.voices);
  const isPaused = useAppSelector((s) => s.classroom.isPaused);

  const indexRef = useRef(0);
  // Store isPaused in a ref so callbacks always see the latest value without
  // needing it in the dependency array (avoids stale closure issues).
  const pausedRef = useRef(isPaused);

  // Sync pausedRef with state outside of render (in an effect)
  useEffect(() => {
    pausedRef.current = isPaused;
  }, [isPaused]);

  // Use a ref to hold the mutable speakChunk function so callbacks can call it
  // without capturing stale closures.
  const speakChunkRef = useRef<(index: number) => void>(() => {});

  const speakChunk = useCallback(
    (index: number) => {
      if (index >= chunks.length) {
        dispatch(setIsPlaying(false));
        dispatch(setCurrentChunkIndex(-1));
        return;
      }

      const chunk = chunks[index];
      dispatch(setCurrentChunkIndex(index));
      dispatch(setSpokenText(chunk.speak));

      if (chunk.diagram) {
        dispatch(setCurrentCommand(chunk.diagram));
        dispatch(setCurrentFormula(chunk.diagram.formula ?? null));
      }

      if (chunk.teacher_position) {
        dispatch(setTeacherPosition(chunk.teacher_position));
      }

      if (chunk.key_point) {
        dispatch(addChalkboardPoint(chunk.key_point));
        dispatch(setIsWritingOnBoard(true));
        setTimeout(() => dispatch(setIsWritingOnBoard(false)), 1500);
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(chunk.speak);

      const voice = voices.find((v) => v.voiceURI === selectedVoice);
      if (voice) {
        const svVoice = window.speechSynthesis
          .getVoices()
          .find((v2) => v2.voiceURI === voice.voiceURI);
        if (svVoice) utterance.voice = svVoice;
      }

      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onend = () => {
        if (!pausedRef.current) {
          indexRef.current = index + 1;
          // Use the ref so we always call the latest version
          speakChunkRef.current(indexRef.current);
        }
      };

      utterance.onerror = () => {
        indexRef.current = index + 1;
        speakChunkRef.current(indexRef.current);
      };

      window.speechSynthesis.speak(utterance);
    },
    [chunks, dispatch, selectedVoice, voices]
  );

  // Keep the ref always pointing to the latest speakChunk
  useEffect(() => {
    speakChunkRef.current = speakChunk;
  }, [speakChunk]);

  const play = useCallback(() => {
    dispatch(setIsPlaying(true));
    dispatch(setIsPaused(false));
    indexRef.current = 0;
    speakChunk(0);
  }, [dispatch, speakChunk]);

  const pause = useCallback(() => {
    dispatch(setIsPaused(true));
    window.speechSynthesis.pause();
  }, [dispatch]);

  const resume = useCallback(() => {
    dispatch(setIsPaused(false));
    window.speechSynthesis.resume();
    if (!window.speechSynthesis.speaking) {
      speakChunk(indexRef.current);
    }
  }, [dispatch, speakChunk]);

  const stop = useCallback(() => {
    dispatch(setIsPlaying(false));
    dispatch(setIsPaused(false));
    dispatch(setCurrentChunkIndex(-1));
    dispatch(setSpokenText(''));
    window.speechSynthesis.cancel();
    indexRef.current = 0;
  }, [dispatch]);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  return { play, pause, resume, stop };
}
