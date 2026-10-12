 'use client';
import { useContext } from 'react';
import { ClassroomPlaybackContext } from '../context/ClassroomPlaybackContext';
export function useChunkPlayer() {
  const player = useContext(ClassroomPlaybackContext);
  if (!player) throw new Error('Classroom playback requires its provider.');
  return player;
}
