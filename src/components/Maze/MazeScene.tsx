import { useMemo } from 'react';
import * as THREE from 'three';
import { MAZE_SIZE, CELL_SIZE } from './mazeData';
import MazeWalls from './MazeWalls';
import Player from './Player';
import Portals from './Portals';
import CameraRig from './CameraRig';
import type { PortalInfo } from './mazeData';

interface MazeSceneProps {
  onPlayerMove: (row: number, col: number, worldPos: THREE.Vector3) => void;
  activePortal: PortalInfo | null;
  playerWorldPos: THREE.Vector3;
}

export default function MazeScene({ onPlayerMove, activePortal, playerWorldPos }: MazeSceneProps) {
  const floorSize = MAZE_SIZE * CELL_SIZE;

  const floorTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;

    // Dark gradient floor
    ctx.fillStyle = '#14142a';
    ctx.fillRect(0, 0, 512, 512);

    // Subtle grid lines
    ctx.strokeStyle = 'rgba(108, 92, 231, 0.25)';
    ctx.lineWidth = 1;
    const gridStep = 512 / MAZE_SIZE;
    for (let i = 0; i <= MAZE_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * gridStep, 0);
      ctx.lineTo(i * gridStep, 512);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * gridStep);
      ctx.lineTo(512, i * gridStep);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }, []);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.6} color="#c8c8ff" />
      <directionalLight
        position={[10, 15, 5]}
        intensity={1.2}
        color="#e8e8ed"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
      <pointLight position={[0, 10, 0]} intensity={1} color="#6c5ce7" distance={40} />

      {/* Fog for atmosphere */}
      <fog attach="fog" args={['#0a0a0f', 20, 50]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[floorSize, floorSize]} />
        <meshStandardMaterial
          map={floorTexture}
          color="#2a2a4a"
          roughness={0.9}
          metalness={0.1}
        />
      </mesh>

      {/* Walls */}
      <MazeWalls />

      {/* Portals */}
      <Portals activePortal={activePortal} />

      {/* Player */}
      <Player onPositionChange={onPlayerMove} />

      {/* Camera */}
      <CameraRig playerWorldPos={playerWorldPos} />
    </>
  );
}
