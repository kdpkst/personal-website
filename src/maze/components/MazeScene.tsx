import { useMemo } from "react";
import * as THREE from "three";
import {
  CELL_SIZE,
  MAZE_GRID,
  MAZE_SIZE,
  PATH,
  PORTALS,
  gridToWorld,
  type PortalInfo,
} from "../data/mazeData";
import AmbientAudio from "./AmbientAudio";
import MazeDoor from "./MazeDoor";
import MazeWalls from "./MazeWalls";
import Player from "./Player";

interface MazeSceneProps {
  onPlayerMove: (row: number, col: number, worldPos: THREE.Vector3) => void;
  activePortal: PortalInfo | null;
  doorOpening: boolean;
}

const LIGHTING = {
  background: "#bfb7ab",
  fog: "#c1b9ac",
  ambient: {
    color: "#ddd5c7",
    intensity: 0.42,
  },
  hemisphere: {
    sky: "#f2ebde",
    ground: "#7b6d5c",
    intensity: 1.15,
  },
  sun: {
    position: [24, 38, -18] as const,
    color: "#f0eadb",
    intensity: 2.15,
  },
  fill: {
    position: [-14, 24, 20] as const,
    color: "#d2c8b8",
    intensity: 0.58,
  },
  overheadBounce: {
    position: [0, 26, 0] as const,
    color: "#c9beab",
    intensity: 0.24,
  },
};

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
}

function createGroundTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create ground texture");
  }

  context.fillStyle = "#695a44";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 9000; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const radius = 1 + Math.random() * 4;
    const shade = 58 + Math.random() * 55;

    context.fillStyle = `rgba(${shade + 20}, ${shade + 8}, ${shade - 8}, 0.12)`;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }

  for (let index = 0; index < 180; index += 1) {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    context.strokeStyle = "rgba(54, 40, 28, 0.12)";
    context.lineWidth = 1 + Math.random() * 3;
    context.beginPath();
    context.moveTo(startX, startY);
    context.bezierCurveTo(
      startX + 40,
      startY - 10,
      startX + 70,
      startY + 10,
      startX + 120,
      startY + Math.random() * 40 - 20,
    );
    context.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(10, 10);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function GroundDebris() {
  const rockMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];

    for (let row = 1; row < MAZE_SIZE - 1; row += 1) {
      for (let col = 1; col < MAZE_SIZE - 1; col += 1) {
        if (MAZE_GRID[row][col] !== PATH) {
          continue;
        }

        const seeded = ((row * 928371 + col * 19211) % 1000) / 1000;
        if (seeded > 0.18) {
          continue;
        }

        const [x, , z] = gridToWorld(row, col);
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3(
          x + (seeded - 0.5) * CELL_SIZE * 0.6,
          0.18,
          z + ((row * col) % 9 / 9 - 0.5) * CELL_SIZE * 0.6,
        );
        const rotation = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(
            seeded * 0.4,
            seeded * Math.PI * 2,
            seeded * 0.22,
          ),
        );
        const uniformScale = 0.16 + seeded * 0.32;
        const scale = new THREE.Vector3(
          uniformScale,
          uniformScale,
          uniformScale,
        );

        matrix.compose(position, rotation, scale);
        matrices.push(matrix);
      }
    }

    return matrices;
  }, []);

  const rootMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];

    for (let row = 1; row < MAZE_SIZE - 1; row += 1) {
      for (let col = 1; col < MAZE_SIZE - 1; col += 1) {
        if (MAZE_GRID[row][col] !== PATH) {
          continue;
        }

        const seeded = ((row * 1217 + col * 3301) % 1000) / 1000;
        if (seeded > 0.11) {
          continue;
        }

        const [x, , z] = gridToWorld(row, col);
        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3(
          x + (seeded - 0.5) * CELL_SIZE * 0.5,
          0.05,
          z + (((row + col) % 7) / 7 - 0.5) * CELL_SIZE * 0.5,
        );
        const rotation = new THREE.Quaternion().setFromEuler(
          new THREE.Euler(Math.PI / 2, seeded * Math.PI * 2, seeded * 0.2),
        );
        const scale = new THREE.Vector3(0.08, 0.9 + seeded * 1.2, 0.08);

        matrix.compose(position, rotation, scale);
        matrices.push(matrix);
      }
    }

    return matrices;
  }, []);

  const rockGeometry = useMemo(() => new THREE.DodecahedronGeometry(1, 0), []);
  const rockMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#7b7062",
        roughness: 1,
        metalness: 0.02,
      }),
    [],
  );
  const rootGeometry = useMemo(() => new THREE.CylinderGeometry(1, 1, 1, 6), []);
  const rootMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#4c3a2d",
        roughness: 1,
        metalness: 0,
      }),
    [],
  );

  return (
    <group>
      <instancedMesh
        args={[rockGeometry, rockMaterial, rockMatrices.length]}
        ref={(mesh) => {
          if (!mesh) {
            return;
          }

          rockMatrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
          mesh.instanceMatrix.needsUpdate = true;
        }}
        castShadow
        receiveShadow
      />

      <instancedMesh
        args={[rootGeometry, rootMaterial, rootMatrices.length]}
        ref={(mesh) => {
          if (!mesh) {
            return;
          }

          rootMatrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
          mesh.instanceMatrix.needsUpdate = true;
        }}
        castShadow
        receiveShadow
      />
    </group>
  );
}

function DustMotes() {
  const particles = useMemo(() => {
    const count = 240;
    const positions = new Float32Array(count * 3);
    const spread = MAZE_SIZE * CELL_SIZE * 0.48;
    const random = createSeededRandom(97131);

    for (let index = 0; index < count; index += 1) {
      positions[index * 3] = (random() - 0.5) * spread * 2;
      positions[index * 3 + 1] = 1 + random() * 14;
      positions[index * 3 + 2] = (random() - 0.5) * spread * 2;
    }

    return positions;
  }, []);

  return (
    <points position={[0, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#d2c8b5"
        size={0.16}
        sizeAttenuation
        transparent
        opacity={0.28}
      />
    </points>
  );
}

export default function MazeScene({
  onPlayerMove,
  activePortal,
  doorOpening,
}: MazeSceneProps) {
  const floorSize = MAZE_SIZE * CELL_SIZE;
  const groundTexture = useMemo(() => createGroundTexture(), []);
  const exitDoor = PORTALS[0];

  return (
    <>
      <color attach="background" args={[LIGHTING.background]} />
      <ambientLight
        intensity={LIGHTING.ambient.intensity}
        color={LIGHTING.ambient.color}
      />
      <hemisphereLight
        args={[
          LIGHTING.hemisphere.sky,
          LIGHTING.hemisphere.ground,
          LIGHTING.hemisphere.intensity,
        ]}
      />
      <directionalLight
        position={LIGHTING.sun.position}
        intensity={LIGHTING.sun.intensity}
        color={LIGHTING.sun.color}
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-far={180}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-bias={-0.00008}
      />
      <directionalLight
        position={LIGHTING.fill.position}
        intensity={LIGHTING.fill.intensity}
        color={LIGHTING.fill.color}
      />
      <directionalLight
        position={LIGHTING.overheadBounce.position}
        intensity={LIGHTING.overheadBounce.intensity}
        color={LIGHTING.overheadBounce.color}
      />

      <fog attach="fog" args={[LIGHTING.fog, 28, 160]} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[floorSize, floorSize]} />
        <meshStandardMaterial
          map={groundTexture}
          color="#817057"
          roughness={1}
          metalness={0.01}
          emissive="#2f281e"
          emissiveIntensity={0.08}
        />
      </mesh>

      <GroundDebris />
      <MazeWalls />
      <MazeDoor
        door={exitDoor}
        isActive={activePortal?.route === exitDoor.route}
        isOpening={doorOpening}
      />
      <DustMotes />
      <Player onPositionChange={onPlayerMove} />
      <AmbientAudio />
    </>
  );
}
