import { useState } from 'react';
import AnimatedImageCard from './AnimatedImageCard';
import ImageAnnotations from './ImageAnnotations';
import type { ImageSceneProps, SavedAnnotation } from '../../../../types/classroom/classroom.types';

export default function ImageScene({ command, url }: ImageSceneProps) {
  const [annotations, setAnnotations] = useState<SavedAnnotation[]>([]);
  const [prevUrl, setPrevUrl] = useState(url);
  const [prevCommand, setPrevCommand] = useState(command);

  // Reset annotations when the image URL changes
  if (url !== prevUrl) {
    setPrevUrl(url);
    setAnnotations([]);
  }

  // Update annotations when a new command is received
  if (command !== prevCommand) {
    setPrevCommand(command);
    if (command?.annotation) {
      const pos = command.annotation_position || 'top_left';
      if (!annotations.some(a => a.text === command.annotation)) {
        setAnnotations(prev => [
          ...prev,
          { text: command.annotation!, position: pos as SavedAnnotation['position'] }
        ]);
      }
    }
  }

  return (
    <group>
      <AnimatedImageCard url={url} command={command} />
      <ImageAnnotations annotations={annotations} />
      <ambientLight intensity={0.8} />
    </group>
  );
}
