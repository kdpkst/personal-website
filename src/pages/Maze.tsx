import { useState, useCallback, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import MazeScene from "../maze/components/MazeScene";
import HUD from "../maze/components/HUD";
import {
  PLAYER_START,
  PORTALS,
  type GridPosition,
  type PortalInfo,
} from "../maze/data/mazeData";

export default function Maze() {
  const navigate = useNavigate();
  const [activePortal, setActivePortal] = useState<PortalInfo | null>(null);
  const [doorOpening, setDoorOpening] = useState(false);
  const [playerCell, setPlayerCell] = useState<GridPosition>(PLAYER_START);

  const handlePlayerMove = useCallback(
    (row: number, col: number) => {
      setPlayerCell((current) => {
        if (current.row === row && current.col === col) {
          return current;
        }

        return { row, col };
      });

      const nearby = PORTALS.find((portal) => {
        return portal.row === row && portal.col === col;
      });

      setActivePortal(nearby || null);
    },
    [],
  );

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Enter" && activePortal && !doorOpening) {
        setDoorOpening(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activePortal, doorOpening]);

  useEffect(() => {
    if (!doorOpening || !activePortal) {
      return;
    }

    const timeout = window.setTimeout(() => {
      document.exitPointerLock?.();
      navigate(activePortal.route);
    }, 1400);

    return () => window.clearTimeout(timeout);
  }, [activePortal, doorOpening, navigate]);

  return (
    <div className="relative h-screen w-full bg-[#0a0a0f]">
      <Canvas
        shadows
        camera={{ position: [0, 12, 12], fov: 56, near: 0.1, far: 180 }}
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.32,
        }}
      >
        <MazeScene
          onPlayerMove={handlePlayerMove}
          activePortal={activePortal}
          doorOpening={doorOpening}
        />
      </Canvas>

      <HUD activePortal={activePortal} playerCell={playerCell} />
    </div>
  );
}
