import { useState, useCallback, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import MazeScene from '../components/Maze/MazeScene';
import HUD from '../components/common/HUD';
import { PORTALS, gridToWorld, PLAYER_START, type PortalInfo } from '../components/Maze/mazeData';

export default function Maze() {
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState<PortalInfo | null>(null);
  const playerWorldPos = useRef(new THREE.Vector3(...gridToWorld(PLAYER_START.row, PLAYER_START.col)));

  const handlePlayerMove = useCallback(
    (row: number, col: number, worldPos: THREE.Vector3) => {
      playerWorldPos.current.copy(worldPos);

      // Check portal proximity
      const nearby = PORTALS.find((p) => p.row === row && p.col === col);
      setActivePortal(nearby || null);
    },
    []
  );

  // Handle Enter key for portal navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && activePortal) {
        navigate(activePortal.route);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePortal, navigate]);

  return (
    <div style={{ width: '100%', height: '100vh', position: 'relative', background: '#0a0a0f' }}>
      <Canvas
        shadows
        camera={{ position: [0, 12, 12], fov: 50, near: 0.1, far: 100 }}
        gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
      >
        <MazeScene
          onPlayerMove={handlePlayerMove}
          activePortal={activePortal}
          playerWorldPos={playerWorldPos.current}
        />
      </Canvas>

      <HUD activePortal={activePortal} />
    </div>
  );
}
