import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Scene from './Scene';
import FormulaOverlay from './FormulaOverlay';
import type { DiagramStageProps } from '../../../../types/classroom/classroom.types';

export default function DiagramStage({ diagramType, command, formula }: DiagramStageProps) {
  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 48 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true }}
      >
        <Scene type={diagramType} command={command} />
        <OrbitControls enablePan={false} enableZoom={true} />
      </Canvas>

      <FormulaOverlay command={command} formula={formula} />
    </div>
  );
}
