import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Line, Text } from '@react-three/drei';
import type { DiagramCommand } from '@/types';
import * as THREE from 'three';

interface ProjectileSceneProps {
  command: DiagramCommand | null;
}

const GRAVITY = 9.8;
const V0 = 8;
const ANGLE = Math.PI / 4; // 45°
const Vx = V0 * Math.cos(ANGLE);
const Vy = V0 * Math.sin(ANGLE);
const TOTAL_TIME = (2 * Vy) / GRAVITY;
const SCALE = 0.35;

function getPosition(t: number): [number, number, number] {
  const x = Vx * t * SCALE - 3;
  const y = (Vy * t - 0.5 * GRAVITY * t * t) * SCALE - 2;
  return [x, y, 0];
}

export function ProjectileScene({ command }: ProjectileSceneProps) {
  const ballRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);
  const speed = command?.speed === 'fast' ? 1.4 : command?.speed === 'slow' ? 0.5 : 0.9;

  useFrame((_, dt) => {
    if (!ballRef.current) return;
    tRef.current = (tRef.current + dt * speed) % TOTAL_TIME;
    const [x, y] = getPosition(tRef.current);
    ballRef.current.position.set(x, y, 0);
  });

  // Pre-compute arc path
  const arcPoints: [number, number, number][] = Array.from({ length: 60 }, (_, i) => {
    const t = (i / 59) * TOTAL_TIME;
    return getPosition(t);
  });

  return (
    <group>
      {/* Arc path */}
      <Line points={arcPoints} color="#6366f1" lineWidth={1.5} dashed dashSize={0.12} gapSize={0.08} />

      {/* Ball */}
      <Sphere ref={ballRef} args={[0.22, 32, 32]} position={[-3, -2, 0]}>
        <meshStandardMaterial color="#f59e0b" roughness={0.3} />
      </Sphere>

      {/* Ground */}
      <Line points={[[-3.2, -2, 0], [3.2, -2, 0]]} color="#334155" lineWidth={2} />

      {/* Velocity arrows at launch */}
      <arrowHelper args={[new THREE.Vector3(1, 0, 0), new THREE.Vector3(-3, -2, 0), 0.8, 0x22d3ee, 0.15, 0.1]} />
      <arrowHelper args={[new THREE.Vector3(0, 1, 0), new THREE.Vector3(-3, -2, 0), 0.8, 0x4ade80, 0.15, 0.1]} />

      {/* Labels */}
      <Text position={[-2.5, -2.7, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        v₀ₓ = v₀cos θ
      </Text>
      <Text position={[0, 1.8, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">
        y = v₀ₜsin θ − ½gt²
      </Text>
      <Text position={[0, -3.2, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
        Projectile Motion — θ = 45°
      </Text>
    </group>
  );
}
