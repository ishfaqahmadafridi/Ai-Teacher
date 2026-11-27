'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FREE_FALL, GRAVITY_SPEED } from '../constants/physicsSceneConstants';
import { freeFallHeight, freeFallTrail, sceneSpeed } from '../utilities/physicsScenes';
import type { DiagramCommand } from '../types/classroom.types';

/** Looping free fall: the ball restarts from the top when it reaches the ground. */
export function useGravityScene(command: DiagramCommand | null) {
  const ballRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const speed = sceneSpeed(command, GRAVITY_SPEED);
  const trailPoints = useMemo(() => freeFallTrail(), []);
  const arrowArgs = useMemo(() => {
    const { direction, origin, length, color, headLength, headWidth } = FREE_FALL.arrow;
    return [new THREE.Vector3(...direction), new THREE.Vector3(...origin), length, color, headLength, headWidth] as const;
  }, []);

  useFrame((_, dt) => {
    if (!ballRef.current) return;
    elapsed.current += dt * speed;
    const height = freeFallHeight(elapsed.current);
    ballRef.current.position.y = height;
    if (height <= FREE_FALL.groundY) elapsed.current = 0;
  });

  return { ballRef, trailPoints, arrowArgs };
}
