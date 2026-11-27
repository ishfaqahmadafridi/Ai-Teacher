'use client';
import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { PROJECTILE, PROJECTILE_SPEED } from '../constants/physicsSceneConstants';
import { PROJECTILE_FLIGHT_TIME, projectileArc, projectilePosition, sceneSpeed } from '../utilities/physicsScenes';
import type { DiagramCommand } from '../types/classroom.types';

/** Projectile flight looped over one launch-to-landing period. */
export function useProjectileScene(command: DiagramCommand | null) {
  const ballRef = useRef<THREE.Mesh>(null);
  const elapsed = useRef(0);
  const speed = sceneSpeed(command, PROJECTILE_SPEED);
  const arcPoints = useMemo(() => projectileArc(), []);
  const arrowArgs = useMemo(() => {
    const origin = new THREE.Vector3(...PROJECTILE.origin, 0);
    const { arrowLength, arrowHead } = PROJECTILE;
    return PROJECTILE.arrows.map(({ direction, color }) =>
      [new THREE.Vector3(...direction), origin, arrowLength, color, arrowHead.length, arrowHead.width] as const);
  }, []);

  useFrame((_, dt) => {
    if (!ballRef.current) return;
    elapsed.current = (elapsed.current + dt * speed) % PROJECTILE_FLIGHT_TIME;
    ballRef.current.position.set(...projectilePosition(elapsed.current));
  });

  return { ballRef, arcPoints, arrowArgs };
}
