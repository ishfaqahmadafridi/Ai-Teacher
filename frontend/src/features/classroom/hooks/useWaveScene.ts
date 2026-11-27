'use client';
import { useMemo, useRef } from 'react';
import type { ComponentRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Line } from '@react-three/drei';
import { WAVE_DEFAULTS } from '../constants/physicsSceneConstants';
import { waveParameters, wavePoints } from '../utilities/physicsScenes';
import type { Vec3, WaveSceneProps } from '../types/board.types';

/** Travelling-wave animation: one sampler for the first render and every frame. */
export function useWaveScene({
  command,
  resolution = WAVE_DEFAULTS.resolution,
  width = WAVE_DEFAULTS.width,
  baseAmplitude = WAVE_DEFAULTS.amplitude,
  baseFrequency = WAVE_DEFAULTS.frequency,
  baseSpeed = WAVE_DEFAULTS.speed,
  color = WAVE_DEFAULTS.color,
}: WaveSceneProps) {
  const elapsed = useRef(0);
  const lineRef = useRef<ComponentRef<typeof Line>>(null);
  const wave = useMemo(
    () => waveParameters(command, { amplitude: baseAmplitude, frequency: baseFrequency, speed: baseSpeed }),
    [command, baseAmplitude, baseFrequency, baseSpeed],
  );
  const initialPoints = useMemo(() => wavePoints(resolution, width, wave), [resolution, width, wave]);
  const axisPoints = useMemo<Vec3[]>(() => [[-width / 2, 0, 0], [width / 2, 0, 0]], [width]);

  useFrame((_, dt) => {
    elapsed.current += dt;
    lineRef.current?.geometry?.setPositions(wavePoints(resolution, width, wave, elapsed.current * wave.speed).flat());
  });

  return { lineRef, initialPoints, axisPoints, color };
}
