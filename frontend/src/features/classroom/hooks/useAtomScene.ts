'use client';
import { useCallback, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type * as THREE from 'three';
import { ATOM_ORBITS } from '../constants/boardConstants';
import { orbitPosition } from '../utilities/physicsScenes';

/** Moves each electron along its orbit; returns a stable ref setter per orbit index. */
export function useAtomScene() {
  const electrons = useRef<(THREE.Mesh | null)[]>(ATOM_ORBITS.map(() => null));

  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    ATOM_ORBITS.forEach((orbit, index) => {
      electrons.current[index]?.position.set(...orbitPosition(orbit, time));
    });
  });

  const electronRef = useCallback((index: number) => (mesh: THREE.Mesh | null) => {
    electrons.current[index] = mesh;
  }, []);

  return { electronRef };
}
