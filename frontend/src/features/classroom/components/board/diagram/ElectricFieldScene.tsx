'use client';
import { useMemo } from 'react';
import { Sphere, Line, Text } from '@react-three/drei';
import * as THREE from 'three';

export function ElectricFieldScene() {
  // Generate dipole field lines using Bezier curves or math formulation
  const fieldLines = useMemo(() => {
    const lines: [number, number, number][][] = [];
    const chargePos1 = new THREE.Vector3(-1.8, 0, 0);
    const chargePos2 = new THREE.Vector3(1.8, 0, 0);

    // Number of field lines starting from positive charge
    const numLines = 12;
    for (let i = 0; i < numLines; i++) {
      const angle = (i / numLines) * Math.PI * 2;
      const dir = new THREE.Vector3(Math.cos(angle), Math.sin(angle), 0);
      
      const points: [number, number, number][] = [];
      const steps = 30;
      
      // Trace line from positive to negative charge
      for (let s = 0; s <= steps; s++) {
        const t = s / steps;
        // Simple cubic bezier interpolation to create dipole curve path
        const p0 = chargePos1;
        const p3 = chargePos2;
        // Control points flare outwards based on starting angle
        const p1 = new THREE.Vector3().copy(chargePos1).addScaledVector(dir, 1.5);
        const p2 = new THREE.Vector3().copy(chargePos2).addScaledVector(new THREE.Vector3(-dir.x, dir.y, 0), 1.5);
        
        const pt = new THREE.Vector3()
          .copy(p0).multiplyScalar(Math.pow(1 - t, 3))
          .addScaledVector(p1, 3 * Math.pow(1 - t, 2) * t)
          .addScaledVector(p2, 3 * (1 - t) * t * t)
          .addScaledVector(p3, Math.pow(t, 3));
          
        points.push([pt.x, pt.y, pt.z]);
      }
      lines.push(points);
    }
    return lines;
  }, []);

  return (
    <group>
      {/* Field Lines */}
      {fieldLines.map((points, idx) => (
        <Line
          key={idx}
          points={points}
          color="#38bdf8"
          lineWidth={1.2}
          opacity={0.6}
          transparent
        />
      ))}

      {/* Positive Charge */}
      <Sphere args={[0.22, 32, 32]} position={[-1.8, 0, 0]}>
        <meshStandardMaterial color="#ef4444" roughness={0.3} />
      </Sphere>
      <Text position={[-1.8, 0.4, 0]} fontSize={0.2} color="#fca5a5" anchorX="center">
        +q (Source)
      </Text>

      {/* Negative Charge */}
      <Sphere args={[0.22, 32, 32]} position={[1.8, 0, 0]}>
        <meshStandardMaterial color="#3b82f6" roughness={0.3} />
      </Sphere>
      <Text position={[1.8, 0.4, 0]} fontSize={0.2} color="#93c5fd" anchorX="center">
        -q (Sink)
      </Text>

      {/* Title */}
      <Text position={[0, -3.2, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">
        Electric Field Dipole Lines
      </Text>
    </group>
  );
}
