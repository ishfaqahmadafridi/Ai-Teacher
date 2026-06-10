import { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import type { WaveSceneProps } from '../../../../types/classroom/classroom.types';

export default function WaveScene({
  command,
  resolution = 80,
  width = 8,
  baseAmplitude = 1.3,
  baseFrequency = 2.0,
  baseSpeed = 2.5,
  color = '#a78bfa',
}: WaveSceneProps) {
  const t = useRef(0);
  const lineRef = useRef<any>(null);
  const [annotations, setAnnotations] = useState<string[]>([]);

  const { amplitude, frequency, speed } = useMemo(() => {
    const customParams = command?.animate as unknown as {
      amplitude?: number;
      frequency?: number;
      speed?: number;
    } | undefined;

    return {
      amplitude: customParams?.amplitude ?? baseAmplitude,
      frequency: customParams?.frequency ?? baseFrequency,
      speed: customParams?.speed ?? baseSpeed,
    };
  }, [command, baseAmplitude, baseFrequency, baseSpeed]);

  useEffect(() => {
    if (command?.annotation) {
      setAnnotations(prev => [...prev, command.annotation!]);
    }
  }, [command]);

  // Initial wave points mapped over range [-width/2, width/2]
  const initialPoints = useMemo(() => {
    const startX = -width / 2;
    return Array.from({ length: resolution }, (_, i): [number, number, number] => {
      const x = startX + (i / (resolution - 1)) * width;
      const y = Math.sin(x * frequency) * amplitude;
      return [x, y, 0];
    });
  }, [resolution, width, frequency, amplitude]);

  // High-performance GPU buffer update loop (Zero React re-renders)
  useFrame((_, dt) => {
    t.current += dt;
    const positions: number[] = [];
    const startX = -width / 2;

    for (let i = 0; i < resolution; i++) {
      const x = startX + (i / (resolution - 1)) * width;
      const y = Math.sin(x * frequency + t.current * speed) * amplitude;
      positions.push(x, y, 0);
    }

    if (lineRef.current?.geometry) {
      lineRef.current.geometry.setPositions(positions);
    }
  });

  return (
    <group>
      <Line ref={lineRef} points={initialPoints} color={color} lineWidth={2.5} />
      <Line
        points={[[-width / 2, 0, 0], [width / 2, 0, 0]] as [number, number, number][]}
        color="#475569"
        lineWidth={1}
      />
      <Text position={[0, 2.2, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
        Wave Motion
      </Text>

      {annotations.map((ann, i) => (
        <Text
          key={i}
          position={[-3.8, 2.0 - i * 0.45, 0]}
          fontSize={0.19}
          color="#e2e8f0"
          anchorX="left"
          outlineWidth={0.02}
          outlineColor="#0f172a"
        >
          {ann}
        </Text>
      ))}

      <ambientLight intensity={0.8} />
    </group>
  );
}
