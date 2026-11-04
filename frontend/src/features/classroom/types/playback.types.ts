import type { ReactNode } from 'react';
export interface ClassroomPlaybackControls { playReply: (text: string) => Promise<void>; play: () => void; playFrom: (startIndex: number) => void; pause: () => void; resume: () => void; stop: () => void }
export interface ClassroomPlaybackProviderProps { children: ReactNode }

export interface LessonAudioCallbacks { onStart: () => void; onEnd: () => void; onError: () => void }

export interface TeacherReplyPlayback {
  utterance: SpeechSynthesisUtterance;
  reject: (error: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}
