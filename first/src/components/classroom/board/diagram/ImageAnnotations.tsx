import { Text } from '@react-three/drei';
import type { ImageAnnotationsProps } from '../../../../types/classroom/classroom.types';

export default function ImageAnnotations({ annotations }: ImageAnnotationsProps) {
  return (
    <>
      {/* Floating annotations */}
      {annotations.map((ann, i) => (
        <Text
          key={i}
          position={[-3.5, 2.5 - i * 0.45, 0]}
          fontSize={0.19}
          color="#e2e8f0"
          anchorX="left"
          outlineWidth={0.02}
          outlineColor="#0f172a"
        >
          {ann}
        </Text>
      ))}
    </>
  );
}
