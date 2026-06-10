/**
 * useChunkPlayer.ts
 * Core orchestration hook that plays professor "chunks" one at a time.
 * For each chunk: fires a diagram command → waits 700ms (so the scene
 * can animate to its position) → speaks the text → moves to the next chunk.
 */

import { useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/store';
import {
  setIsPlaying,
  setCurrentChunkIndex,
  setSpokenText,
} from '../../redux/classroomSlice';
import type { Chunk, DiagramCommand } from '../../types/classroom/classroom.types';

interface ChunkPlayerState {
  isPlaying: boolean;
  currentChunkIndex: number;
  spokenText: string;
  play: (
    chunks: Chunk[],
    onDiagramCommand: (cmd: DiagramCommand) => void,
    voiceName?: string | null,
    onKeyPoint?: (point: string) => void
  ) => void;
  stop: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * stripForSpeech
 * Remove any LaTeX, SVG, or markdown that would sound weird when spoken aloud.
 */
function stripForSpeech(text: string): string {
  return text
    .replace(/<svg[\s\S]*?<\/svg>/gi, 'See the diagram on screen.')
    .replace(/\$\$[\s\S]*?\$\$/g, 'See the formula on screen.')
    .replace(/\$[^$]+?\$/g, 'see the formula on screen,')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/[#*_~>`|\\]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/** Small delay helper */
const wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms));

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * useChunkPlayer
 *
 * Plays an array of professor chunks sequentially:
 *   1. Fires diagram command for the chunk (diagram starts animating).
 *   2. Waits DIAGRAM_PAUSE_MS so the scene can reach its position.
 *   3. Speaks the chunk text via SpeechSynthesis.
 *   4. Waits for speech to end, then moves to the next chunk.
 *
 * The onDiagramCommand callback is called BEFORE speech starts,
 * with a pause in between so the visual animation is visible first.
 */

/** How long to wait (ms) after firing a diagram command before speaking. */
const DIAGRAM_PAUSE_MS = 700;

export function useChunkPlayer(): ChunkPlayerState {
  const dispatch = useAppDispatch();
  const isPlaying = useAppSelector(state => state.classroom.isPlaying);
  const currentChunkIndex = useAppSelector(state => state.classroom.currentChunkIndex);
  const spokenText = useAppSelector(state => state.classroom.spokenText);

  // Used to cancel mid-play
  const cancelledRef = useRef(false);
  const fallbackTimerRef = useRef<any>(null);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (fallbackTimerRef.current) {
      clearInterval(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    dispatch(setIsPlaying(false));
    dispatch(setCurrentChunkIndex(-1));
    dispatch(setSpokenText(''));
  }, [dispatch]);

  const play = useCallback(
    (
      chunks: Chunk[],
      onDiagramCommand: (cmd: DiagramCommand) => void,
      voiceName?: string | null,
      onKeyPoint?: (point: string) => void
    ) => {
      if (!chunks || chunks.length === 0) return;

      // Stop any existing playback first
      cancelledRef.current = true;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (fallbackTimerRef.current) {
        clearInterval(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }

      // Small delay so cancel settles before we restart
      setTimeout(() => {
        cancelledRef.current = false;
        dispatch(setIsPlaying(true));
        dispatch(setCurrentChunkIndex(0));
        dispatch(setSpokenText(''));

        /**
         * speakChunk — async function that plays one chunk at a time.
         * When a chunk finishes speaking, it calls itself for the next chunk.
         */
        const speakChunk = async (index: number) => {
          // Clear any active timer from the previous chunk
          if (fallbackTimerRef.current) {
            clearInterval(fallbackTimerRef.current);
            fallbackTimerRef.current = null;
          }
          dispatch(setSpokenText(''));

          // Stop condition
          if (cancelledRef.current || index >= chunks.length) {
            dispatch(setIsPlaying(false));
            dispatch(setCurrentChunkIndex(-1));
            dispatch(setSpokenText(''));
            return;
          }

          const chunk = chunks[index];
          dispatch(setCurrentChunkIndex(index));

          // 1. Fire diagram command FIRST (diagram starts animating)
          const hasDiagram = chunk.diagram && chunk.diagram.action !== 'none';
          if (hasDiagram) {
            onDiagramCommand(chunk.diagram!);
          }

          // 2. Write key_point to chalkboard NOW (live, as each phase starts)
          if (onKeyPoint && chunk.key_point) {
            onKeyPoint(chunk.key_point);
          }

          // 3. Wait for diagram to animate before speaking
          if (hasDiagram) {
            await wait(DIAGRAM_PAUSE_MS);
          }

          if (cancelledRef.current) return;

          // 4. Prepare TTS utterance
          const cleanText = stripForSpeech(chunk.speak);
          if (!cleanText) {
            // Skip empty chunks
            speakChunk(index + 1);
            return;
          }

          const utterance = new SpeechSynthesisUtterance(cleanText);
          utterance.rate = 0.92;    // slightly slower than default for clarity
          utterance.pitch = 1.05;   // slightly warm/human tone
          utterance.volume = 1.0;

          // Assign chosen voice if provided
          if (voiceName && typeof window !== 'undefined' && window.speechSynthesis) {
            const allVoices = window.speechSynthesis.getVoices();
            const match = allVoices.find(
              (v) => v.voiceURI === voiceName || v.name === voiceName
            );
            if (match) utterance.voice = match;
          }

          // Word-by-word reveal variables
          let hasBoundaryFired = false;
          const words = cleanText.split(' ');
          let currentWordIndex = 0;

          const startFallbackTypewriter = () => {
            if (fallbackTimerRef.current) return;
            fallbackTimerRef.current = setInterval(() => {
              if (currentWordIndex < words.length) {
                currentWordIndex++;
                const textSoFar = words.slice(0, currentWordIndex).join(' ');
                dispatch(setSpokenText(textSoFar));
              } else {
                if (fallbackTimerRef.current) {
                  clearInterval(fallbackTimerRef.current);
                  fallbackTimerRef.current = null;
                }
              }
            }, 320); // 320ms per word average speaking speed
          };

          // 5. Watch speech synthesis boundaries
          utterance.onboundary = (event) => {
            if (event.name === 'word') {
              hasBoundaryFired = true;
              if (fallbackTimerRef.current) {
                clearInterval(fallbackTimerRef.current);
                fallbackTimerRef.current = null;
              }
              const charIndex = event.charIndex;
              const remaining = cleanText.slice(charIndex);
              const spaceIdx = remaining.indexOf(' ');
              const endIdx = spaceIdx === -1 ? cleanText.length : charIndex + spaceIdx;
              const textSoFar = cleanText.slice(0, endIdx);
              dispatch(setSpokenText(textSoFar));
            }
          };

          utterance.onstart = () => {
            // If native boundary events don't fire within 800ms of starting, use typewriter fallback
            setTimeout(() => {
              if (!hasBoundaryFired && !cancelledRef.current) {
                startFallbackTypewriter();
              }
            }, 800);
          };

          // 6. When this chunk finishes speaking, move to next chunk
          utterance.onend = () => {
            if (fallbackTimerRef.current) {
              clearInterval(fallbackTimerRef.current);
              fallbackTimerRef.current = null;
            }
            if (!cancelledRef.current) {
              speakChunk(index + 1);
            }
          };

          utterance.onerror = () => {
            if (fallbackTimerRef.current) {
              clearInterval(fallbackTimerRef.current);
              fallbackTimerRef.current = null;
            }
            if (!cancelledRef.current) {
              speakChunk(index + 1); // skip broken chunks, keep going
            }
          };

          if (typeof window !== 'undefined' && window.speechSynthesis) {
            window.speechSynthesis.speak(utterance);
          }
        };

        // Start playing from chunk 0
        speakChunk(0);
      }, 100);
    },
    [dispatch]
  );

  return { isPlaying, currentChunkIndex, spokenText, play, stop };
}
