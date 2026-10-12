'use client';
import { createContext } from 'react';
import type { ClassroomPlaybackControls } from '../types/playback.types';
export const ClassroomPlaybackContext = createContext<ClassroomPlaybackControls | null>(null);
