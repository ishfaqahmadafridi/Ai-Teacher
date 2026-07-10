import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Torus, Text } from '@react-three/drei';
import * as THREE from 'three';

const ORBITS = [
  { radius: 1.1, speed: 1.2, color: '#60a5fa', electronColor: '#3b82f6', phaseOffset: 0 },
  { radius: 1.8, speed: 0.7, color: '#a78bfa', electronColor: '#8b5cf6', phaseOffset: 1.1 },
  { radius: 2.5, speed: 0.45, color: '#34d399', electronColor: '#10b981', phaseOffset: 2.3 },
] as const;

export function AtomScene() {
  const electronRefs = useRef<(THREE.Mesh | null)[]>([null, null, null]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    ORBITS.forEach(({ radius, speed, phaseOffset = 0 }, i) => {
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
      {ORBITS.map(({ radius, color, electronColor }, i) => (
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
