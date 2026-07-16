import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Text } from '@react-three/drei';
import type { DiagramCommand } from '@/features/classroom/types/classroom.types';
import * as THREE from 'three';

interface GravitySceneProps {
  command: DiagramCommand | null;
}

export function GravityScene({ command }: GravitySceneProps) {
  const ballRef = useRef<THREE.Mesh>(null);
  const t = useRef(0);
  const speed = command?.speed === 'fast' ? 1.5 : command?.speed === 'slow' ? 0.5 : 1;

  useFrame((_, dt) => {
    if (!ballRef.current) return;
    t.current += dt * speed;
    // Simulate free-fall: y = -½gt² (looped every 2.5s)
    const cycle = t.current % 2.5;
    const y = 2.5 - 0.5 * 9.8 * cycle * cycle * 0.1;
    ballRef.current.position.y = Math.max(-2.2, y);
    if (ballRef.current.position.y <= -2.2) t.current = 0;
  });

  // Trajectory dotted line
  const trailPoints: [number, number, number][] = Array.from({ length: 20 }, (_, i) => [
    0,
    2.5 - i * 0.24,
    0,
  ]);

  return (
    <group>
      {/* Dotted trail */}
      <Line points={trailPoints} color="#475569" lineWidth={1} dashed dashSize={0.15} gapSize={0.1} />

      {/* Falling ball */}
      <Sphere ref={ballRef} args={[0.28, 32, 32]} position={[0, 2.5, 0]}>
        <meshStandardMaterial color="#7c3aed" roughness={0.3} metalness={0.5} />
      </Sphere>

      {/* Ground */}
      <Line points={[[-3, -2.2, 0], [3, -2.2, 0]]} color="#334155" lineWidth={2} />

      {/* Labels */}
      <Text position={[0.6, 2.5, 0]} fontSize={0.22} color="#a78bfa" anchorX="left">
        Ball
      </Text>
      <Text position={[-2.5, -2.5, 0]} fontSize={0.2} color="#64748b" anchorX="left">
        Ground
      </Text>
      <Text position={[0, -3.2, 0]} fontSize={0.24} color="#94a3b8" anchorX="center">
        Free Fall — F = mg
      </Text>

      {/* Gravity arrow */}
      <arrowHelper
        args={[
          new THREE.Vector3(0, -1, 0),
          new THREE.Vector3(0, 1, 0),
          1.2,
          0xf59e0b,
          0.2,
          0.12,
        ]}
      />
    </group>
  );
}
