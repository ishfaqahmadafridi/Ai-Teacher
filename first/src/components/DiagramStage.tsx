/**
 * DiagramStage.tsx
 * Three.js 3D scene (via @react-three/fiber) that visualises physics concepts.
 *
 * KEY CHANGE: The ProjectileScene is now a STATE MACHINE.
 * Instead of looping the ball continuously, it responds to animate.move commands:
 *   "to_launch"  → ball eases to the launch position and STOPS
 *   "rise"       → ball slowly rises to apex
 *   "pause_apex" → ball freezes at the very top
 *   "fall"       → ball falls from apex to landing
 *   "land"       → ball eases to the ground on the right
 *   "loop"       → continuous full loop (for background/intro phases)
 *   "none"       → ball stays wherever it is
 *
 * Annotations appear ON the diagram at each concept moment and ACCUMULATE
 * (never removed), exactly like a professor writing on a whiteboard.
 */

import { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
import * as THREE from 'three';
import type { DiagramCommand } from '../hooks/useChunkPlayer';

export type DiagramType =
  | 'gravity' | 'electric_field' | 'projectile'
  | 'wave' | 'circuit' | 'atom' | 'default';

interface DiagramStageProps {
  diagramType: DiagramType;
  command: DiagramCommand | null;
  formula: string | null;
}

// ── Parabola helpers ─────────────────────────────────────────────────────────
const LAUNCH_X = -3.2;
const LAND_X   =  3.2;
const GROUND_Y = -1.5;
const APEX_Y   =  2.1;

/** Get ball position for t ∈ [0,1] along the parabola */
function parabolaPos(t: number): [number, number, number] {
  const x = LAUNCH_X + t * (LAND_X - LAUNCH_X);
  const y = GROUND_Y + (APEX_Y - GROUND_Y) * (4 * t * (1 - t));
  return [x, y, 0];
}

/** t values for named positions */
const T_LAUNCH = 0.0;
const T_APEX   = 0.5;
const T_LAND   = 1.0;

// ─────────────────────────────────────────────────────────────────────────────
// PROJECTILE SCENE — STATE MACHINE
// ─────────────────────────────────────────────────────────────────────────────
type BallMove = 'to_launch' | 'rise' | 'pause_apex' | 'fall' | 'land' | 'loop' | 'none';

interface ProjectileAnnotation {
  text: string;
  screenPos: 'top_left' | 'top_right' | 'bottom_left' | 'bottom_right' | 'center';
  worldPos: [number, number, number];
}

function ProjectileScene({ command }: { command: DiagramCommand | null }) {
  const ballRef     = useRef<THREE.Mesh>(null!);

  // Animation state machine
  const tRef        = useRef(T_LAUNCH);         // current t along parabola [0,1]
  const targetTRef  = useRef(T_LAUNCH);         // target t we are easing toward
  const moveRef     = useRef<BallMove>('none');  // current movement mode
  const loopDir     = useRef(1);                 // +1 = forward, -1 = reverse

  // Accumulated annotations (never cleared — whiteboard effect)
  const [annotations, setAnnotations] = useState<ProjectileAnnotation[]>([]);

  // Arrow visibility state
  const [showVxArrow, setShowVxArrow]    = useState(false);
  const [showVyArrow, setShowVyArrow]    = useState(false);
  const [showGravArrow, setShowGravArrow] = useState(false);
  const [showPath, setShowPath]           = useState(false);
  const [ballPos, setBallPos]             = useState<[number,number,number]>(parabolaPos(T_LAUNCH));
  const [ballVisible, setBallVisible]     = useState(false);

  // Process incoming command
  useEffect(() => {
    if (!command) return;

    const move = command.animate?.move as BallMove | undefined;
    const action = command.action;

    if (action === 'show_initial') {
      setBallVisible(true);
      setShowPath(true);
      tRef.current = T_LAUNCH;
      moveRef.current = 'none';
    }

    if (move) {
      moveRef.current = move;
      if (move === 'to_launch') {
        targetTRef.current = T_LAUNCH;
        setBallVisible(true);
        setShowPath(true);
      } else if (move === 'rise') {
        targetTRef.current = T_APEX;
        setShowVxArrow(true);
      } else if (move === 'pause_apex') {
        targetTRef.current = T_APEX;
        setShowVyArrow(true);
      } else if (move === 'fall') {
        targetTRef.current = T_LAND * 0.75;
        setShowGravArrow(true);
      } else if (move === 'land') {
        targetTRef.current = T_LAND;
      }
    }

    // Add annotation if present
    if (command.annotation) {
      const currentBallPos = parabolaPos(tRef.current);
      // Slightly offset so labels don't overlap the ball
      const offset: [number,number,number] = [
        currentBallPos[0] + 0.3,
        currentBallPos[1] + 0.45,
        0
      ];
      setAnnotations(prev => [
        ...prev,
        {
          text: command.annotation!,
          screenPos: (command.annotation_position ?? 'top_right') as ProjectileAnnotation['screenPos'],
          worldPos: offset,
        }
      ]);
    }
  }, [command]);

  // Animation loop — smooth easing toward targetT
  useFrame((_, dt) => {
    const mode = moveRef.current;

    if (mode === 'loop') {
      // Continuous loop
      tRef.current += dt * 0.35 * loopDir.current;
      if (tRef.current >= T_LAND) { tRef.current = T_LAND; loopDir.current = -1; }
      if (tRef.current <= T_LAUNCH) { tRef.current = T_LAUNCH; loopDir.current = 1; }
    } else if (mode !== 'none') {
      // Ease toward target
      const diff = targetTRef.current - tRef.current;
      const step = dt * 0.7; // ease speed
      if (Math.abs(diff) < 0.002) {
        tRef.current = targetTRef.current;
        moveRef.current = 'none'; // arrived — stop
      } else {
        tRef.current += Math.sign(diff) * Math.min(Math.abs(diff), step);
      }
    }

    const pos = parabolaPos(tRef.current);
    if (ballRef.current) {
      ballRef.current.position.set(...pos);
    }
    setBallPos(pos);
  });

  // Parabola path points
  const pathPoints = useMemo<[number,number,number][]>(
    () => Array.from({ length: 60 }, (_, i) => parabolaPos(i / 59)),
    []
  );

  const ballWorldPos = ballPos;

  return (
    <group>
      {/* Ground */}
      <mesh position={[0, GROUND_Y - 0.06, 0]}>
        <boxGeometry args={[8, 0.08, 0.5]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Parabola path (dashed) */}
      {showPath && (
        <Line points={pathPoints} color="#facc15" lineWidth={1.5} dashed dashSize={0.15} gapSize={0.1} />
      )}

      {/* Ball */}
      {ballVisible && (
        <mesh ref={ballRef} position={parabolaPos(T_LAUNCH)}>
          <sphereGeometry args={[0.24, 20, 20]} />
          <meshStandardMaterial color="#fb923c" emissive="#ea580c" emissiveIntensity={0.6} roughness={0.3} />
        </mesh>
      )}

      {/* Horizontal velocity arrow (Vx) */}
      {showVxArrow && (
        <group position={[ballWorldPos[0], ballWorldPos[1] + 0.05, 0]}>
          <Line
            points={[[0,0,0],[0.9,0,0]]}
            color="#34d399"
            lineWidth={2.5}
          />
          <mesh position={[1.0, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.08, 0.22, 8]} />
            <meshStandardMaterial color="#34d399" />
          </mesh>
          <Text position={[0.55, 0.28, 0]} fontSize={0.19} color="#34d399" anchorX="center">
            Vx
          </Text>
        </group>
      )}

      {/* Vertical velocity arrow (Vy — only at apex, zero) */}
      {showVyArrow && (
        <group position={[ballWorldPos[0] + 0.05, ballWorldPos[1], 0]}>
          <Line points={[[0,0,0],[0,0.01,0]]} color="#f472b6" lineWidth={2} />
          <Text position={[0.28, 0.22, 0]} fontSize={0.18} color="#f472b6" anchorX="center">
            Vy=0
          </Text>
        </group>
      )}

      {/* Gravity arrow (always downward) */}
      {showGravArrow && (
        <group position={[ballWorldPos[0], ballWorldPos[1], 0]}>
          <Line points={[[0,0.05,0],[0,-0.7,0]]} color="#f87171" lineWidth={2.5} />
          <mesh position={[0, -0.8, 0]}>
            <coneGeometry args={[0.09, 0.24, 8]} />
            <meshStandardMaterial color="#f87171" />
          </mesh>
          <Text position={[0.35, -0.4, 0]} fontSize={0.18} color="#f87171" anchorX="center">
            g
          </Text>
        </group>
      )}

      {/* Accumulated annotation labels (world-space) */}
      {annotations.map((ann, i) => (
        <Text
          key={i}
          position={ann.worldPos}
          fontSize={0.185}
          color="#e2e8f0"
          anchorX="left"
          outlineWidth={0.025}
          outlineColor="#0f172a"
          maxWidth={3}
        >
          {ann.text}
        </Text>
      ))}

      <ambientLight intensity={0.6} />
      <pointLight position={[3, 5, 3]} intensity={1.1} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GRAVITY SCENE
// ─────────────────────────────────────────────────────────────────────────────
function GravityScene({ command }: { command: DiagramCommand | null }) {
  const earthRef = useRef<THREE.Mesh>(null!);
  const [highlighted, setHighlighted] = useState(false);
  const [annotations, setAnnotations] = useState<string[]>([]);
  const speedRef = useRef(0.004);

  useEffect(() => {
    if (!command) return;
    if (command.action === 'highlight' && command.target === 'earth') setHighlighted(true);
    if (command.action === 'rotate') speedRef.current = command.speed === 'fast' ? 0.025 : 0.006;
    if (command.action === 'none') setHighlighted(false);
    if (command.annotation) setAnnotations(prev => [...prev, command.annotation!]);
  }, [command]);

  useFrame(() => { if (earthRef.current) earthRef.current.rotation.y += speedRef.current; });

  const arrows: { from: [number,number,number]; to: [number,number,number] }[] = [
    { from: [0, 3, 0],  to: [0, 1.4, 0]  },
    { from: [0, -3, 0], to: [0, -1.4, 0] },
    { from: [3, 0, 0],  to: [1.4, 0, 0]  },
    { from: [-3, 0, 0], to: [-1.4, 0, 0] },
  ];

  return (
    <group>
      <mesh ref={earthRef}>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshStandardMaterial
          color={highlighted ? '#7dd3fc' : '#4a90d9'}
          emissive={highlighted ? '#1e40af' : '#000'}
          emissiveIntensity={highlighted ? 0.7 : 0}
          roughness={0.4} metalness={0.1}
        />
      </mesh>
      <Text position={[0, -1.8, 0]} fontSize={0.24} color="#94a3b8" anchorX="center">
        Earth  (M)
      </Text>

      {arrows.map((a, i) => (
        <Line key={i} points={[a.from, a.to]} color="#facc15" lineWidth={2} />
      ))}

      {[
        { pos: [0, 1.4, 0],  rot: [0, 0, 0]            },
        { pos: [0, -1.4, 0], rot: [Math.PI, 0, 0]      },
        { pos: [1.4, 0, 0],  rot: [0, 0, -Math.PI / 2] },
        { pos: [-1.4, 0, 0], rot: [0, 0, Math.PI / 2]  },
      ].map((h, i) => (
        <mesh key={i} position={h.pos as [number,number,number]} rotation={h.rot as [number,number,number]}>
          <coneGeometry args={[0.12, 0.3, 8]} />
          <meshStandardMaterial color="#facc15" />
        </mesh>
      ))}

      {/* Accumulated annotations */}
      {annotations.map((ann, i) => (
        <Text key={i} position={[2.2, 2.5 - i * 0.45, 0]} fontSize={0.19} color="#e2e8f0"
          anchorX="left" outlineWidth={0.02} outlineColor="#0f172a">
          {ann}
        </Text>
      ))}

      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ATOM SCENE — Bohr model
// ─────────────────────────────────────────────────────────────────────────────
function AtomScene({ command }: { command: DiagramCommand | null }) {
  const e1Ref = useRef<THREE.Mesh>(null!);
  const e2Ref = useRef<THREE.Mesh>(null!);
  const [nucleusGlow, setNucleusGlow] = useState(false);
  const [annotations, setAnnotations] = useState<string[]>([]);
  const angle1 = useRef(0);
  const angle2 = useRef(Math.PI);

  useEffect(() => {
    if (command?.action === 'highlight' && command.target === 'nucleus') setNucleusGlow(true);
    else if (command?.action === 'none') setNucleusGlow(false);
    if (command?.annotation) setAnnotations(prev => [...prev, command.annotation!]);
  }, [command]);

  useFrame((_, dt) => {
    angle1.current += dt * 1.3;
    angle2.current += dt * 0.85;
    if (e1Ref.current) {
      e1Ref.current.position.set(Math.cos(angle1.current) * 2.0, 0, Math.sin(angle1.current) * 2.0);
    }
    if (e2Ref.current) {
      e2Ref.current.position.set(Math.cos(angle2.current) * 2.8, Math.sin(angle2.current) * 0.5, Math.sin(angle2.current) * 2.8);
    }
  });

  const orbit1 = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(a) * 2.0, 0, Math.sin(a) * 2.0]);
    }
    return pts;
  }, []);

  const orbit2 = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i <= 64; i++) {
      const a = (i / 64) * Math.PI * 2;
      pts.push([Math.cos(a) * 2.8, Math.sin(a) * 0.5, Math.sin(a) * 2.8]);
    }
    return pts;
  }, []);

  return (
    <group>
      <mesh>
        <sphereGeometry args={[0.5, 20, 20]} />
        <meshStandardMaterial
          color="#f87171"
          emissive={nucleusGlow ? '#ef4444' : '#000'}
          emissiveIntensity={nucleusGlow ? 0.9 : 0.1}
        />
      </mesh>
      <Text position={[0.7, 0.6, 0]} fontSize={0.2} color="#f87171">Nucleus</Text>

      <Line points={orbit1} color="#334155" lineWidth={1} />
      <Line points={orbit2} color="#334155" lineWidth={1} />

      <mesh ref={e1Ref}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.6} />
      </mesh>
      <mesh ref={e2Ref}>
        <sphereGeometry args={[0.18, 12, 12]} />
        <meshStandardMaterial color="#60a5fa" emissive="#1d4ed8" emissiveIntensity={0.6} />
      </mesh>

      {annotations.map((ann, i) => (
        <Text key={i} position={[-3.5, 2.8 - i * 0.45, 0]} fontSize={0.19} color="#e2e8f0"
          anchorX="left" outlineWidth={0.02} outlineColor="#0f172a">
          {ann}
        </Text>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[4, 4, 4]} intensity={1.0} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WAVE SCENE — animated sine wave
// ─────────────────────────────────────────────────────────────────────────────
function WaveScene({ command }: { command: DiagramCommand | null }) {
  const t = useRef(0);
  const [, setTick] = useState(0);
  const pointsRef = useRef<[number,number,number][]>([]);
  const [annotations, setAnnotations] = useState<string[]>([]);

  useEffect(() => {
    if (command?.annotation) setAnnotations(prev => [...prev, command.annotation!]);
  }, [command]);

  useFrame((_, dt) => {
    t.current += dt;
    pointsRef.current = Array.from({ length: 80 }, (_, i) => {
      const x = (i / 79) * 8 - 4;
      const y = Math.sin(x * 2 + t.current * 2.5) * 1.3;
      return [x, y, 0] as [number,number,number];
    });
    setTick(n => n + 1);
  });

  const pts = pointsRef.current.length > 0
    ? pointsRef.current
    : Array.from({ length: 80 }, (_, i): [number,number,number] => {
        const x = (i / 79) * 8 - 4;
        return [x, Math.sin(x * 2) * 1.3, 0];
      });

  return (
    <group>
      <Line points={pts} color="#a78bfa" lineWidth={2.5} />
      <Line points={[[-4,0,0],[4,0,0]] as [number,number,number][]} color="#475569" lineWidth={1} />
      <Text position={[0, 2.2, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">Wave Motion</Text>

      {annotations.map((ann, i) => (
        <Text key={i} position={[-3.8, 2.0 - i * 0.45, 0]} fontSize={0.19} color="#e2e8f0"
          anchorX="left" outlineWidth={0.02} outlineColor="#0f172a">
          {ann}
        </Text>
      ))}

      <ambientLight intensity={0.8} />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT SCENE — rotating sphere
// ─────────────────────────────────────────────────────────────────────────────
function DefaultScene({ command }: { command: DiagramCommand | null }) {
  const sphereRef = useRef<THREE.Mesh>(null!);
  const speed = useRef(0.006);
  const [annotations, setAnnotations] = useState<string[]>([]);

  useEffect(() => {
    if (command?.action === 'rotate')
      speed.current = command.speed === 'fast' ? 0.028 : 0.008;
    if (command?.annotation) setAnnotations(prev => [...prev, command.annotation!]);
  }, [command]);

  useFrame(() => { if (sphereRef.current) sphereRef.current.rotation.y += speed.current; });

  return (
    <group>
      <mesh ref={sphereRef}>
        <sphereGeometry args={[1.4, 32, 32]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.25} metalness={0.3}
          emissive="#1d4ed8" emissiveIntensity={0.1} />
      </mesh>

      {annotations.map((ann, i) => (
        <Text key={i} position={[-3.5, 2.8 - i * 0.45, 0]} fontSize={0.19} color="#e2e8f0"
          anchorX="left" outlineWidth={0.02} outlineColor="#0f172a">
          {ann}
        </Text>
      ))}

      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1.2} />
      <pointLight position={[-5, -3, -5]} intensity={0.4} color="#818cf8" />
    </group>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Scene selector
// ─────────────────────────────────────────────────────────────────────────────
function Scene({ type, command }: { type: DiagramType; command: DiagramCommand | null }) {
  switch (type) {
    case 'gravity':    return <GravityScene command={command} />;
    case 'atom':       return <AtomScene command={command} />;
    case 'projectile': return <ProjectileScene command={command} />;
    case 'wave':       return <WaveScene command={command} />;
    default:           return <DefaultScene command={command} />;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DiagramStage — exported component
// ─────────────────────────────────────────────────────────────────────────────
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

      {/* Formula overlay -- center-upper area so teacher doesn't block it */}
      {(command?.action === 'show_formula_stepwise' || command?.action === 'show_formula') && (formula || (command as any).formula) && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div
            className="px-8 py-4 rounded-2xl backdrop-blur shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,0,0,0.88) 0%, rgba(15,20,40,0.92) 100%)',
              border: '1px solid rgba(250,204,21,0.4)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.7), 0 0 24px rgba(250,204,21,0.08)',
            }}
          >
            <p className="text-yellow-300 text-2xl font-mono text-center tracking-wide">
              {formula || (command as any).formula}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
