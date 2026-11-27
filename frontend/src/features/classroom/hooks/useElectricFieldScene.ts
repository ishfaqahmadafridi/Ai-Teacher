'use client';
import { useMemo } from 'react';
import { dipoleFieldLines } from '../utilities/physicsScenes';

/** Field lines are fixed for the scene, so they are computed once. */
export function useElectricFieldScene() {
  const fieldLines = useMemo(() => dipoleFieldLines(), []);
  return { fieldLines };
}
