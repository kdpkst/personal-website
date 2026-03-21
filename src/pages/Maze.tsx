import { useState, useCallback, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import MazeScene from "../components/Maze/MazeScene";
import HUD from "../components/Maze/HUD";
import {
  PORTALS,
  gridToWorld,
  PLAYER_START,
  type PortalInfo,
} from "../components/Maze/mazeData";

export default function Maze() {
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState<PortalInfo | null>(null);
  const playerWorldPosRef = useRef(
    new THREE.Vector3(...gridToWorld(PLAYER_START.row, PLAYER_START.col)),
  );

  const handlePlayerMove = useCallback(
    (row: number, col: number, worldPos: THREE.Vector3) => {
      playerWorldPosRef.current.copy(worldPos);

      const nearby = PORTALS.find((portal) => {
        return portal.row === row && portal.col === col;
      });

      setActivePortal(nearby || null);
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && activePortal) {
        navigate(activePortal.route);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePortal, navigate]);

  return (
    <div className="relative h-screen w-full bg-[#0a0a0f]">
      <Canvas
        shadows
        camera={{ position: [0, 12, 12], fov: 50, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
      >
        <MazeScene
          onPlayerMove={handlePlayerMove}
          activePortal={activePortal}
          playerWorldPosRef={playerWorldPosRef}
        />
      </Canvas>

      <HUD activePortal={activePortal} />
    </div>
  );
}
