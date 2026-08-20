'use client';

import { memo } from 'react';
import { Image as DreiImage } from '@react-three/drei';
import type { ImageSceneProps } from '../../../types/board.types';

export const ImageScene = memo(function ImageScene({ url }: ImageSceneProps) {
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
});

ImageScene.displayName = 'ImageScene';
