import { useRef, useCallback, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { isWalkable, gridToWorld, PLAYER_START } from './mazeData';

const MOVE_SPEED = 4; // units per second
const PLAYER_RADIUS = 0.35;

interface PlayerProps {
  onPositionChange: (row: number, col: number, worldPos: THREE.Vector3) => void;
}

export default function Player({ onPositionChange }: PlayerProps) {
  const groupRef = useRef<THREE.Group>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const gridPos = useRef({ row: PLAYER_START.row, col: PLAYER_START.col });
  const targetPos = useRef(new THREE.Vector3(...gridToWorld(PLAYER_START.row, PLAYER_START.col)));
  const currentPos = useRef(new THREE.Vector3(...gridToWorld(PLAYER_START.row, PLAYER_START.col)));
  const isMoving = useRef(false);
  const facingAngle = useRef(0);
  const bobPhase = useRef(0);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysRef.current.add(e.key);
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysRef.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    const keys = keysRef.current;

    // Process movement when not already moving
    if (!isMoving.current) {
      let dr = 0;
      let dc = 0;

      if (keys.has('ArrowUp') || keys.has('w') || keys.has('W')) dr = -1;
      else if (keys.has('ArrowDown') || keys.has('s') || keys.has('S')) dr = 1;
      else if (keys.has('ArrowLeft') || keys.has('a') || keys.has('A')) dc = -1;
      else if (keys.has('ArrowRight') || keys.has('d') || keys.has('D')) dc = 1;

      if (dr !== 0 || dc !== 0) {
        const newRow = gridPos.current.row + dr;
        const newCol = gridPos.current.col + dc;

        // Set facing direction
        facingAngle.current = Math.atan2(dc, -dr);

        if (isWalkable(newRow, newCol)) {
          gridPos.current.row = newRow;
          gridPos.current.col = newCol;
          const [wx, wy, wz] = gridToWorld(newRow, newCol);
          targetPos.current.set(wx, wy, wz);
          isMoving.current = true;
        }
      }
    }

    // Smooth movement interpolation
    if (isMoving.current) {
      const moveStep = MOVE_SPEED * delta;
      const dx = targetPos.current.x - currentPos.current.x;
      const dz = targetPos.current.z - currentPos.current.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.05) {
        currentPos.current.copy(targetPos.current);
        isMoving.current = false;
      } else {
        currentPos.current.x += (dx / dist) * Math.min(moveStep, dist);
        currentPos.current.z += (dz / dist) * Math.min(moveStep, dist);
      }

      // Walking bob
      bobPhase.current += delta * 12;
    }

    // Apply position with bob
    const bobY = isMoving.current ? Math.sin(bobPhase.current) * 0.05 : 0;
    groupRef.current.position.set(
      currentPos.current.x,
      PLAYER_RADIUS + 0.3 + bobY,
      currentPos.current.z
    );

    // Smooth rotation
    const currentRot = groupRef.current.rotation.y;
    const targetRot = facingAngle.current;
    let rotDiff = targetRot - currentRot;
    // Normalize angle diff
    while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
    while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
    groupRef.current.rotation.y += rotDiff * Math.min(1, delta * 10);

    // Report position
    onPositionChange(gridPos.current.row, gridPos.current.col, currentPos.current);
  });

  return (
    <group ref={groupRef} position={[...gridToWorld(PLAYER_START.row, PLAYER_START.col)]}>
      {/* Body */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <capsuleGeometry args={[PLAYER_RADIUS, 0.3, 8, 16]} />
        <meshStandardMaterial
          color="#6c5ce7"
          roughness={0.3}
          metalness={0.6}
          emissive="#6c5ce7"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshStandardMaterial
          color="#a29bfe"
          roughness={0.2}
          metalness={0.5}
          emissive="#a29bfe"
          emissiveIntensity={0.2}
        />
      </mesh>

      {/* Eye indicator (front) */}
      <mesh position={[0, 0.65, -0.18]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* Glow light */}
      <pointLight color="#6c5ce7" intensity={0.6} distance={3} />
    </group>
  );
}
