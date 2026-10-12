'use client';
import { useCallback, useEffect, useRef } from 'react';
import { useLessonAudioPlayer } from './useLessonAudioPlayer';
import { selectSpeechVoice } from '../utilities/speechVoiceSelection';
import { SPEECH_START_TIMEOUT_MS, SPEECH_START_FAILURE } from '../constants/playbackConstants';
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
  setVoiceError,
  setPendingQuestion,
} from '@/features/classroom/state/classroomSlice';

export function useChunkPlaybackOwner() {
  const dispatch = useAppDispatch();
  const noteId = useAppSelector((s) => s.classroom.noteId);
  const { playAudio, stopAudio, pauseAudio, resumeAudio } = useLessonAudioPlayer();
  const useFileAudioRef = useRef(false);
  const chunks = useAppSelector((s) => s.classroom.chunks);
  const selectedVoice = useAppSelector((s) => s.classroom.selectedVoice);
  const isPaused = useAppSelector((s) => s.classroom.isPaused);

  const failedVoicesRef = useRef(new Set<string>());
  const voiceModeRef = useRef<'explicit' | 'browser' | 'alternate'>('explicit');
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const clearStartTimer = useCallback(() => {
    if (startTimerRef.current !== null) clearTimeout(startTimerRef.current);
    startTimerRef.current = null;
  }, []);
  const indexRef = useRef(0);
  const playbackRunRef = useRef(0);
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

      if (useFileAudioRef.current && noteId) {
        const run = playbackRunRef.current;
        dispatch(setCurrentChunkIndex(index));
        dispatch(setSpokenText(chunks[index].speak));
        dispatch(setIsPlaying(true));
        void playAudio(noteId, index, chunks[index].speak, {
          onStart: () => {
            if (run !== playbackRunRef.current) return;
            dispatch(setVoiceError(null));
            const chunk = chunks[index];
            if (chunk.key_point) dispatch(addChalkboardPoint(chunk.key_point));
            dispatch(setCurrentCommand(chunk.diagram ?? null));
            dispatch(setCurrentFormula(chunk.diagram?.formula ?? null));
          },
          onEnd: () => {
            if (run !== playbackRunRef.current) return;
            if (chunks[index].question) {
              dispatch(setPendingQuestion({ sectionIndex: index, question: chunks[index].question! }));
              dispatch(setIsPlaying(false));
            } else speakChunkRef.current(index + 1);
          },
          onError: () => {
            if (run !== playbackRunRef.current) return;
            dispatch(setIsPlaying(false));
            dispatch(setVoiceError('Server audio could not play. Check the audio request and browser media permission. Your lesson text is saved.'));
          },
        });
        return;
      }
      indexRef.current = index;
      clearStartTimer();
      const run = playbackRunRef.current;
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


      if (!window.speechSynthesis || typeof SpeechSynthesisUtterance === 'undefined') {
        dispatch(setIsPlaying(false));
        dispatch(setVoiceError('Audio playback is not supported in this browser.'));
        return;
      }
      if (window.speechSynthesis.paused) window.speechSynthesis.resume();
      const utterance = new SpeechSynthesisUtterance(chunk.speak);
      utteranceRef.current = utterance;

      const availableVoices = window.speechSynthesis.getVoices();
      if (!availableVoices.length) {
        dispatch(addChalkboardPoint(chunk.speak));
        dispatch(setIsPlaying(false));
        dispatch(setVoiceError('No speech voices are available yet. Select Retry audio after voices load; if none load, enable a system speech voice in your device settings.'));
        return;
      }
      const voice = voiceModeRef.current === 'browser' ? availableVoices[0]
        : selectSpeechVoice(availableVoices, selectedVoice, failedVoicesRef.current, document.documentElement.lang || navigator.language);
      if (!voice) {
        dispatch(setIsPlaying(false));
        dispatch(addChalkboardPoint(chunk.speak));
        dispatch(setVoiceError('Available speech voices failed to start. Your browser or system speech service needs attention; the lesson text remains available.'));
        return;
      }
      // A listed voice can still be unusable. On retry, first let the browser
      // choose its own voice; after another failure, try a different installed voice.
      if (voiceModeRef.current !== 'browser') utterance.voice = voice;
      utterance.lang = voiceModeRef.current === 'browser' ? document.documentElement.lang || navigator.language : voice.lang;
      utterance.volume = 1;

      utterance.rate = 0.95;
      utterance.pitch = 1.05;

      utterance.onstart = () => {
        if (run !== playbackRunRef.current) return;
        clearStartTimer();
        dispatch(setVoiceError(null));
        if (chunk.key_point) dispatch(addChalkboardPoint(chunk.key_point));
        dispatch(setIsWritingOnBoard(Boolean(chunk.key_point)));
      };

      utterance.onend = () => {
        if (run !== playbackRunRef.current) return;
        clearStartTimer();
        utteranceRef.current = null;
        dispatch(setIsWritingOnBoard(false));
        if (chunk.question) {
          dispatch(setPendingQuestion({ sectionIndex: index, question: chunk.question }));
          dispatch(setIsPlaying(false));
          return;
        }
        if (!pausedRef.current) {
          indexRef.current = index + 1;
          // Use the ref so we always call the latest version
          speakChunkRef.current(indexRef.current);
        }
      };

      utterance.onerror = (event) => {
        if (run !== playbackRunRef.current || event.error === 'canceled' || event.error === 'interrupted') return;
        clearStartTimer();
        dispatch(addChalkboardPoint(chunk.speak));
        dispatch(setIsPlaying(false));
        dispatch(setIsWritingOnBoard(false));
        dispatch(setVoiceError(`Audio playback stopped (${event.error}). Check browser audio permissions and try your question again.`));
      };

      startTimerRef.current = setTimeout(() => {
        if (run !== playbackRunRef.current) return;
        const engine = window.speechSynthesis;
        console.warn('[Classroom speech] startup timed out', {
          voice: voice.name, language: voice.lang, localVoice: voice.localService,
          voiceCount: availableVoices.length, paused: engine.paused,
          pending: engine.pending, speaking: engine.speaking,
          userActivated: navigator.userActivation?.hasBeenActive,
        });
        if (voiceModeRef.current !== 'browser') failedVoicesRef.current.add(voice.voiceURI);
        voiceModeRef.current = voiceModeRef.current === 'explicit' ? 'browser' : 'alternate';
        playbackRunRef.current += 1;
        window.speechSynthesis.cancel();
        utteranceRef.current = null;
        dispatch(setIsPlaying(false));
        dispatch(setIsWritingOnBoard(false));
        dispatch(addChalkboardPoint(chunk.speak));
        if (noteId) {
          useFileAudioRef.current = true;
          speakChunkRef.current(index);
        } else dispatch(setVoiceError(SPEECH_START_FAILURE));
      }, SPEECH_START_TIMEOUT_MS);
      window.speechSynthesis.speak(utterance);
    },
    [chunks, dispatch, selectedVoice, clearStartTimer, noteId, playAudio]
  );

  // Keep the ref always pointing to the latest speakChunk
  useEffect(() => {
    speakChunkRef.current = speakChunk;
  }, [speakChunk]);

  const play = useCallback(() => {
    playbackRunRef.current += 1;
    window.speechSynthesis?.cancel();
    pausedRef.current = false;
    dispatch(setIsPlaying(true));
    dispatch(setIsPaused(false));
    indexRef.current = 0;
    speakChunk(0);
  }, [dispatch, speakChunk]);

  const pause = useCallback(() => {
    pausedRef.current = true;
    dispatch(setIsPaused(true));
    if (useFileAudioRef.current) pauseAudio();
    else window.speechSynthesis?.pause();
  }, [dispatch, pauseAudio]);

  const resume = useCallback(() => {
    pausedRef.current = false;
    dispatch(setIsPaused(false));
    if (useFileAudioRef.current) { resumeAudio(); return; }
    window.speechSynthesis.resume();
    if (!window.speechSynthesis.speaking) {
      speakChunk(indexRef.current);
    }
  }, [dispatch, speakChunk, resumeAudio]);

  const stop = useCallback(() => {
    stopAudio();
    clearStartTimer();
    utteranceRef.current = null;
    playbackRunRef.current += 1;
    dispatch(setIsPlaying(false));
    dispatch(setIsPaused(false));
    dispatch(setCurrentChunkIndex(-1));
    dispatch(setSpokenText(''));
    window.speechSynthesis?.cancel();
    indexRef.current = 0;
  }, [dispatch, clearStartTimer, stopAudio]);

  useEffect(() => {
    return () => {
      clearStartTimer();
      utteranceRef.current = null;
      playbackRunRef.current += 1;
      window.speechSynthesis?.cancel();
    };
  }, [clearStartTimer]);

  return { play, pause, resume, stop };
}
