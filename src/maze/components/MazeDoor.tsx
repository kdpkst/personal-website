import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  CELL_SIZE,
  getPortalWorldPosition,
  type PortalInfo,
} from "../data/mazeData";

interface MazeDoorProps {
  door: PortalInfo;
  isActive: boolean;
  isOpening: boolean;
}

const DOOR_WIDTH = CELL_SIZE * 0.58;
const DOOR_HEIGHT = CELL_SIZE * 1.2;
const DOOR_THICKNESS = 0.28;
const FRAME_THICKNESS = 0.44;
const FRAME_DEPTH = 0.9;
const FRAME_WIDTH = DOOR_WIDTH + FRAME_THICKNESS * 1.6;
const FRAME_HEIGHT = DOOR_HEIGHT + FRAME_THICKNESS * 1.4;

function createWoodDoorTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 2048;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create wood door texture");
  }

  const baseGradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  baseGradient.addColorStop(0, "#6c4a35");
  baseGradient.addColorStop(0.5, "#593d2d");
  baseGradient.addColorStop(1, "#402c20");
  context.fillStyle = baseGradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const plankWidth = canvas.width / 5;
  for (let plank = 0; plank < 5; plank += 1) {
    const x = plank * plankWidth;
    const shade = 48 + plank * 6;

    context.fillStyle = `rgba(${shade + 40}, ${shade + 18}, ${shade + 4}, 0.12)`;
    context.fillRect(x + 8, 0, plankWidth - 16, canvas.height);

    context.strokeStyle = "rgba(24, 14, 8, 0.28)";
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let index = 0; index < 4200; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const length = 18 + Math.random() * 140;
    const alpha = 0.035 + Math.random() * 0.04;

    context.strokeStyle = `rgba(255, 214, 176, ${alpha})`;
    context.lineWidth = 1 + Math.random() * 2;
    context.beginPath();
    context.moveTo(x, y);
    context.bezierCurveTo(
      x + 6,
      y + length * 0.25,
      x - 8,
      y + length * 0.7,
      x + 4,
      y + length,
    );
    context.stroke();
  }

  for (let index = 0; index < 140; index += 1) {
    const x = 80 + Math.random() * (canvas.width - 160);
    const y = 120 + Math.random() * (canvas.height - 240);
    const width = 20 + Math.random() * 60;

    context.strokeStyle = `rgba(22, 16, 12, ${0.14 + Math.random() * 0.08})`;
    context.lineWidth = 1 + Math.random() * 1.6;
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + width, y + Math.random() * 16 - 8);
    context.stroke();
  }

  const vignette = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.1,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width * 0.75,
  );
  vignette.addColorStop(0, "rgba(255,255,255,0)");
  vignette.addColorStop(1, "rgba(18,10,6,0.25)");
  context.fillStyle = vignette;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createMetalTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create metal texture");
  }

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#847563");
  gradient.addColorStop(0.5, "#655848");
  gradient.addColorStop(1, "#4c4135");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 1000; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const shade = 96 + Math.random() * 70;
    context.fillStyle = `rgba(${shade}, ${shade - 8}, ${shade - 18}, 0.08)`;
    context.fillRect(x, y, 2, 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function DoorPanels() {
  const panelSpecs = [
    { y: DOOR_HEIGHT * 0.7, height: DOOR_HEIGHT * 0.28 },
    { y: DOOR_HEIGHT * 0.28, height: DOOR_HEIGHT * 0.28 },
  ];

  return (
    <>
      {panelSpecs.map((panel) => (
        <group
          key={`${panel.y}-${panel.height}`}
          position={[DOOR_WIDTH * 0.5, panel.y, DOOR_THICKNESS * 0.52]}
        >
          <mesh castShadow>
            <boxGeometry
              args={[DOOR_WIDTH * 0.67, panel.height, DOOR_THICKNESS * 0.2]}
            />
            <meshStandardMaterial
              color="#7f5b42"
              roughness={0.8}
              metalness={0.04}
            />
          </mesh>
          <mesh position={[0, 0, -DOOR_THICKNESS * 0.08]} castShadow>
            <boxGeometry
              args={[DOOR_WIDTH * 0.54, panel.height * 0.72, DOOR_THICKNESS * 0.12]}
            />
            <meshStandardMaterial
              color="#5f4331"
              roughness={0.9}
              metalness={0.02}
            />
          </mesh>
        </group>
      ))}
    </>
  );
}

export default function MazeDoor({
  door,
  isActive,
  isOpening,
}: MazeDoorProps) {
  const doorPivotRef = useRef<THREE.Group>(null);
  const openingProgress = useRef(0);
  const woodTexture = useMemo(() => createWoodDoorTexture(), []);
  const metalTexture = useMemo(() => createMetalTexture(), []);

  const { x, y, z, rotationY } = getPortalWorldPosition(door);

  useFrame((_, delta) => {
    openingProgress.current = THREE.MathUtils.damp(
      openingProgress.current,
      isOpening ? 1 : 0,
      3.4,
      delta,
    );

    if (doorPivotRef.current) {
      doorPivotRef.current.rotation.y =
        -openingProgress.current * Math.PI * 0.58;
    }
  });

  return (
    <group position={[x, y, z]} rotation={[0, rotationY, 0]}>
      <mesh position={[0, FRAME_HEIGHT * 0.48, -0.34]} receiveShadow>
        <boxGeometry args={[FRAME_WIDTH + 0.46, FRAME_HEIGHT + 0.52, 0.74]} />
        <meshStandardMaterial
          color="#4a433a"
          roughness={1}
          metalness={0.02}
          emissive="#120f0c"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh position={[0, FRAME_HEIGHT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[FRAME_WIDTH, FRAME_HEIGHT, FRAME_DEPTH]} />
        <meshStandardMaterial
          color="#847b6d"
          roughness={1}
          metalness={0.04}
          emissive="#2a241e"
          emissiveIntensity={0.06}
        />
      </mesh>

      <mesh
        position={[0, FRAME_HEIGHT / 2, FRAME_DEPTH * 0.24]}
        receiveShadow
      >
        <boxGeometry
          args={[DOOR_WIDTH + 0.26, DOOR_HEIGHT + 0.24, FRAME_DEPTH * 0.32]}
        />
        <meshStandardMaterial
          color="#665f54"
          roughness={1}
          metalness={0.03}
        />
      </mesh>

      <group ref={doorPivotRef} position={[-DOOR_WIDTH / 2, 0, FRAME_DEPTH * 0.28]}>
        <mesh
          position={[DOOR_WIDTH / 2, DOOR_HEIGHT / 2, 0]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[DOOR_WIDTH, DOOR_HEIGHT, DOOR_THICKNESS]} />
          <meshStandardMaterial
            map={woodTexture}
            color="#704f39"
            roughness={0.82}
            metalness={0.05}
          />
        </mesh>

        <DoorPanels />

        {[0.18, DOOR_HEIGHT * 0.5, DOOR_HEIGHT * 0.82].map((hingeY) => (
          <mesh
            key={hingeY}
            position={[0.06, hingeY, DOOR_THICKNESS * 0.48]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[0.06, 0.06, 0.18, 10]} />
            <meshStandardMaterial
              map={metalTexture}
              color="#7a6a58"
              roughness={0.55}
              metalness={0.7}
            />
          </mesh>
        ))}

        <mesh
          position={[DOOR_WIDTH - 0.36, DOOR_HEIGHT * 0.46, DOOR_THICKNESS * 0.62]}
          castShadow
        >
          <boxGeometry args={[0.14, 0.46, 0.08]} />
          <meshStandardMaterial
            map={metalTexture}
            color={isActive ? "#b49768" : "#8f7a60"}
            emissive={isActive ? "#9b7a4b" : "#1f1912"}
            emissiveIntensity={isActive ? 0.45 : 0.08}
            roughness={0.45}
            metalness={0.82}
          />
        </mesh>

        <mesh
          position={[DOOR_WIDTH - 0.36, DOOR_HEIGHT * 0.46, DOOR_THICKNESS * 0.74]}
          castShadow
        >
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshStandardMaterial
            map={metalTexture}
            color={isActive ? "#c6a772" : "#9d8667"}
            emissive={isActive ? "#a98853" : "#201914"}
            emissiveIntensity={isActive ? 0.32 : 0.06}
            roughness={0.36}
            metalness={0.88}
          />
        </mesh>
      </group>

      <mesh
        position={[0, FRAME_HEIGHT + 0.1, 0.08]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[FRAME_WIDTH + 0.16, 0.36, FRAME_DEPTH * 0.74]} />
        <meshStandardMaterial
          color="#93897c"
          roughness={1}
          metalness={0.02}
        />
      </mesh>

      <mesh
        position={[0, 0.08, FRAME_DEPTH * 0.12]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[FRAME_WIDTH + 0.14, 0.16, FRAME_DEPTH * 0.58]} />
        <meshStandardMaterial
          color="#63584c"
          roughness={1}
          metalness={0.02}
        />
      </mesh>
    </group>
  );
}
