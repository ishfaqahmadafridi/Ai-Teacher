import { memo, useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import type { WaveSceneProps } from '../../../types/board.types';

export const WaveScene = memo(function WaveScene({
  command,
  resolution = 80,
  width = 8,
  baseAmplitude = 1.3,
  baseFrequency = 2.0,
  baseSpeed = 2.5,
  color = '#a78bfa',
}: WaveSceneProps) {
  const t = useRef(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lineRef = useRef<any>(null);

  const { amplitude, frequency, speed } = useMemo(() => {
    const custom = command?.animate as unknown as {
      amplitude?: number;
      frequency?: number;
      speed?: number;
    } | undefined;
    return {
      amplitude: custom?.amplitude ?? baseAmplitude,
      frequency: custom?.frequency ?? baseFrequency,
      speed: custom?.speed ?? baseSpeed,
    };
  }, [command, baseAmplitude, baseFrequency, baseSpeed]);

  const initialPoints = useMemo<[number, number, number][]>(() => {
    const startX = -width / 2;
    return Array.from({ length: resolution }, (_, i) => {
      const x = startX + (i / (resolution - 1)) * width;
      return [x, Math.sin(x * frequency) * amplitude, 0];
    });
  }, [resolution, width, frequency, amplitude]);

  useFrame((_, dt) => {
    t.current += dt;
    const positions: number[] = [];
    const startX = -width / 2;
    for (let i = 0; i < resolution; i++) {
      const x = startX + (i / (resolution - 1)) * width;
      positions.push(x, Math.sin(x * frequency + t.current * speed) * amplitude, 0);
    }
    if (lineRef.current?.geometry) {
      lineRef.current.geometry.setPositions(positions);
    }
  });

  return (
    <group>
      {/* Zero axis */}
      <Line
        points={[[-width / 2, 0, 0], [width / 2, 0, 0]] as [number, number, number][]}
        color="#475569"
        lineWidth={1}
      />
      {/* Animated wave */}
      <Line ref={lineRef} points={initialPoints} color={color} lineWidth={2.5} />

      <Text position={[0, 2.4, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
        Wave Motion — y = A sin(kx − ωt)
      </Text>
    </group>
  );
});

WaveScene.displayName = 'WaveScene';
