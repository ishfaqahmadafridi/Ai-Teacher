import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';
import { ATOM_ORBITS } from '../../../constants/boardConstants';

export function AtomScene() {
  const electronRefs = useRef<(THREE.Mesh | null)[]>([null, null, null]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ATOM_ORBITS.forEach(({ radius, speed, phaseOffset = 0 }, i) => {
      const mesh = electronRefs.current[i];
      if (!mesh) return;
      const angle = t * speed + phaseOffset;
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
    });
  });

  return (
    <group>
      {/* Nucleus */}
      <Sphere args={[0.28, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.4} />
      </Sphere>
      <Text position={[0.4, 0.1, 0]} fontSize={0.18} color="#fbbf24" anchorX="left">
        Nucleus
      </Text>

      {/* Orbital rings and electrons */}
      {ATOM_ORBITS.map(({ radius, color, electronColor }, i) => (
        <group key={i}>
          <Torus args={[radius, 0.015, 8, 64]} rotation={[Math.PI / 2, 0, 0]}>
            <meshStandardMaterial color={color} opacity={0.4} transparent />
          </Torus>
          <Sphere
            ref={(el) => { electronRefs.current[i] = el; }}
            args={[0.1, 16, 16]}
          >
            <meshStandardMaterial color={electronColor} emissive={electronColor} emissiveIntensity={0.5} />
          </Sphere>
        </group>
      ))}

      <Text position={[0, -3.2, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
        Atomic Structure — Electron Orbitals
      </Text>
    </group>
  );
}
