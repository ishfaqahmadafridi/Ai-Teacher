/**
 * useChunkPlayer.ts
 * Core orchestration hook that plays professor "chunks" one at a time.
 * For each chunk: fires a diagram command → waits 700ms (so the scene
 * can animate to its position) → speaks the text → moves to the next chunk.
 */

import { useState, useRef, useCallback } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface DiagramCommand {
  action:
    | 'none'
    | 'highlight'
    | 'rotate'
    | 'zoom'
    | 'zoom_in'
    | 'zoom_out'
    | 'show_formula'
    | 'show_formula_stepwise'
    | 'show_initial'
    | 'add_arrow'
    | 'add_label'
    | 'pause_and_highlight'
    | 'pause_and_explain';
  target?: string;
  speed?: 'slow' | 'fast';
  formula?: string;
  animate?: { object: string; move: string; speed: string };
  annotation?: string;
  annotation_position?: string;
}

export interface Chunk {
  speak: string;
  diagram?: DiagramCommand;   // optional — phase 0 (background) has no diagram
  key_point?: string | null;  // forwarded so Classroom can write it live
}

interface ChunkPlayerState {
  isPlaying: boolean;
  currentChunkIndex: number;
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
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(-1);

  // Used to cancel mid-play
  const cancelledRef = useRef(false);

  const stop = useCallback(() => {
    cancelledRef.current = true;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setCurrentChunkIndex(-1);
  }, []);

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
      window.speechSynthesis.cancel();

      // Small delay so cancel settles before we restart
      setTimeout(() => {
        cancelledRef.current = false;
        setIsPlaying(true);
        setCurrentChunkIndex(0);

        /**
         * speakChunk — async function that plays one chunk at a time.
         * When a chunk finishes speaking, it calls itself for the next chunk.
         */
        const speakChunk = async (index: number) => {
          // Stop condition
          if (cancelledRef.current || index >= chunks.length) {
            setIsPlaying(false);
            setCurrentChunkIndex(-1);
            return;
          }

          const chunk = chunks[index];
          setCurrentChunkIndex(index);

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
          if (voiceName) {
            const allVoices = window.speechSynthesis.getVoices();
            const match = allVoices.find(
              (v) => v.voiceURI === voiceName || v.name === voiceName
            );
            if (match) utterance.voice = match;
          }

          // 5. When this chunk finishes speaking, move to next chunk
          utterance.onend = () => {
            if (!cancelledRef.current) {
              speakChunk(index + 1);
            }
          };

          utterance.onerror = () => {
            if (!cancelledRef.current) {
              speakChunk(index + 1); // skip broken chunks, keep going
            }
          };

          window.speechSynthesis.speak(utterance);
        };

        // Start playing from chunk 0
        speakChunk(0);
      }, 100);
    },
    []
  );

  return { isPlaying, currentChunkIndex, play, stop };
}

