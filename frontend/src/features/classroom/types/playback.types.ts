import type { ReactNode } from 'react';
export interface ClassroomPlaybackControls { play: () => void; pause: () => void; resume: () => void; stop: () => void }
export interface ClassroomPlaybackProviderProps { children: ReactNode }

export interface LessonAudioCallbacks { onStart: () => void; onEnd: () => void; onError: () => void }
