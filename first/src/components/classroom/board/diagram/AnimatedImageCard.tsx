import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Image } from '@react-three/drei';
import * as THREE from 'three';
import { getRotationSpeed, getZoomFactor, getFloatOffset } from '../../../../utils/imageUtils';
import type { AnimatedImageCardProps } from '../../../../types/classroom/classroom.types';

export default function AnimatedImageCard({ url, command }: AnimatedImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const rotationSpeed = useRef(0);
  const zoomFactor = useRef(1);

  useEffect(() => {
    if (!command) return;
    rotationSpeed.current = getRotationSpeed(command.action, command.speed);
    zoomFactor.current = getZoomFactor(command.action);
  }, [command]);

  useFrame((state) => {
    if (!meshRef.current) return;

    // Floating animation
    meshRef.current.position.y = getFloatOffset(state.clock.elapsedTime);

    // Apply continuous rotation if action is rotate
    if (rotationSpeed.current > 0) {
      meshRef.current.rotation.y += rotationSpeed.current;
    } else {
      // Smoothly return to front-facing rotation
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
    }

    // Smoothly scale/zoom
    const targetScale = zoomFactor.current;
    meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, targetScale * 3.5, 0.1);
    meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale * 2.5, 0.1);
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      {/* We use Drei's high-level Image component which handles loaders and shaders automatically */}
      <Image url={url} transparent opacity={0.95} toneMapped={false} />
    </mesh>
  );
}
