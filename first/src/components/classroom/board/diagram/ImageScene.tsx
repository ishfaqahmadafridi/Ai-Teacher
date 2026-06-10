import { useState, useEffect } from 'react';
import AnimatedImageCard from './AnimatedImageCard';
import ImageAnnotations from './ImageAnnotations';
import type { ImageSceneProps } from '../../../../types/classroom/classroom.types';

export default function ImageScene({ command, url }: ImageSceneProps) {
  const [annotations, setAnnotations] = useState<string[]>([]);

  useEffect(() => {
    if (command?.annotation) {
      setAnnotations(prev => [...prev, command.annotation!]);
    }
  }, [command]);

  return (
    <group>
      <AnimatedImageCard url={url} command={command} />
      <ImageAnnotations annotations={annotations} />
      <ambientLight intensity={0.8} />
    </group>
  );
}
