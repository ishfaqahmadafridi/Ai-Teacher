import { Text } from '@react-three/drei';
import type { ImageAnnotationsProps } from '../../../../types/classroom/classroom.types';

export default function ImageAnnotations({ annotations }: ImageAnnotationsProps) {
  // Map position strings to 3D offsets relative to the image card centered at X = 1.5
  const getCoordinates = (pos: string) => {
    switch (pos) {
      case 'top_left':
        return [-0.5, 1.4, 0.1];
      case 'top_right':
        return [3.5, 1.4, 0.1];
      case 'bottom_left':
        return [-0.5, -1.4, 0.1];
      case 'bottom_right':
        return [3.5, -1.4, 0.1];
      case 'center':
      default:
        return [1.5, 0, 0.1];
    }
  };

  return (
    <>
      {/* Dynamic 3D blackboard annotations positioned around the image card */}
      {annotations.map((ann, i) => {
        const coords = getCoordinates(ann.position);
        const anchor = ann.position.includes('right')
          ? 'right'
          : ann.position === 'center'
          ? 'center'
          : 'left';

        return (
          <Text
            key={i}
            position={[coords[0], coords[1], coords[2]]}
            fontSize={0.19}
            color="#facc15" // Yellow/gold text to stand out nicely as chalk on chalkboard
            anchorX={anchor}
            outlineWidth={0.02}
            outlineColor="#0f172a"
          >
            {ann.text}
          </Text>
        );
      })}
    </>
  );
}
