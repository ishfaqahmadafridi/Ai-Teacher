'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Scene } from './Scene';
import type { DiagramCommand, DiagramType } from '@/features/classroom/types/classroom.types';
import { CLASSROOM_LAYOUT } from '@/features/classroom/utilities/classroomConfig';

interface DiagramCanvasProps {
  diagramType: DiagramType;
  command: DiagramCommand | null;
}

export default function DiagramCanvas({ diagramType, command }: DiagramCanvasProps) {
  return (
    <Canvas
      camera={{ position: CLASSROOM_LAYOUT.camera.position, fov: CLASSROOM_LAYOUT.camera.fov }}
      style={{ background: 'transparent' }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <Scene type={diagramType} command={command} />
      <OrbitControls enablePan={false} enableZoom={true} />
    </Canvas>
  );
}
