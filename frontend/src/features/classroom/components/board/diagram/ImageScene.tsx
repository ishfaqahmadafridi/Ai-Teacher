'use client';
import { Image as DreiImage } from '@react-three/drei';
import type { DiagramCommand } from '@/features/classroom/types/classroom.types';

interface ImageSceneProps {
  command: DiagramCommand | null;
  url: string;
}

export function ImageScene({ url }: ImageSceneProps) {
  if (!url) return null;

  return (
    <group>
      {/* 3D Quad displaying the image texture */}
      <DreiImage
        url={url}
        scale={[4.8, 3.2]}
        position={[0, 0, 0]}
        transparent
      />
    </group>
  );
}
