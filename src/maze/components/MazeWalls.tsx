import { useMemo } from "react";
import * as THREE from "three";
import { CELL_SIZE, MAZE_GRID, MAZE_SIZE, WALL } from "../data/mazeData";

const WALL_HEIGHT = 18;

function createStoneTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 1024;
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create stone texture");
  }

  context.fillStyle = "#6a665d";
  context.fillRect(0, 0, canvas.width, canvas.height);

  for (let index = 0; index < 6200; index += 1) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 10 + 2;
    const shade = 78 + Math.random() * 70;
    context.fillStyle = `rgba(${shade}, ${shade - 6}, ${shade - 12}, 0.18)`;
    context.fillRect(x, y, size, size * (0.6 + Math.random() * 1.4));
  }

  for (let index = 0; index < 180; index += 1) {
    const startX = Math.random() * canvas.width;
    const startY = Math.random() * canvas.height;
    const endX = startX + (Math.random() - 0.5) * 80;
    const endY = startY + 30 + Math.random() * 120;

    context.strokeStyle = `rgba(44, 46, 39, ${0.08 + Math.random() * 0.1})`;
    context.lineWidth = 1 + Math.random() * 2;
    context.beginPath();
    context.moveTo(startX, startY);
    context.lineTo(endX, endY);
    context.stroke();
  }

  for (let index = 0; index < 220; index += 1) {
    const mossX = Math.random() * canvas.width;
    const mossY = Math.random() * canvas.height;
    const radius = 12 + Math.random() * 36;

    const gradient = context.createRadialGradient(
      mossX,
      mossY,
      0,
      mossX,
      mossY,
      radius,
    );
    gradient.addColorStop(0, "rgba(70, 96, 58, 0.28)");
    gradient.addColorStop(0.55, "rgba(80, 112, 66, 0.18)");
    gradient.addColorStop(1, "rgba(80, 112, 66, 0)");
    context.fillStyle = gradient;
    context.fillRect(mossX - radius, mossY - radius, radius * 2, radius * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 2.2);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

export default function MazeWalls() {
  const wallMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const offset = (MAZE_SIZE * CELL_SIZE) / 2;

    for (let row = 0; row < MAZE_SIZE; row += 1) {
      for (let col = 0; col < MAZE_SIZE; col += 1) {
        if (MAZE_GRID[row][col] !== WALL) {
          continue;
        }

        const matrix = new THREE.Matrix4();
        const position = new THREE.Vector3(
          col * CELL_SIZE - offset + CELL_SIZE / 2,
          WALL_HEIGHT / 2,
          row * CELL_SIZE - offset + CELL_SIZE / 2,
        );
        const scale = new THREE.Vector3(
          1,
          0.92 + ((row * 17 + col * 13) % 7) * 0.03,
          1,
        );

        matrix.compose(position, new THREE.Quaternion(), scale);
        matrices.push(matrix);
      }
    }

    return matrices;
  }, []);

  const corniceMatrices = useMemo(() => {
    const matrices: THREE.Matrix4[] = [];
    const offset = (MAZE_SIZE * CELL_SIZE) / 2;

    for (let row = 0; row < MAZE_SIZE; row += 1) {
      for (let col = 0; col < MAZE_SIZE; col += 1) {
        if (MAZE_GRID[row][col] !== WALL) {
          continue;
        }

        const matrix = new THREE.Matrix4();
        matrix.setPosition(
          col * CELL_SIZE - offset + CELL_SIZE / 2,
          WALL_HEIGHT - 0.7,
          row * CELL_SIZE - offset + CELL_SIZE / 2,
        );
        matrices.push(matrix);
      }
    }

    return matrices;
  }, []);

  const stoneTexture = useMemo(() => createStoneTexture(), []);
  const wallGeometry = useMemo(
    () => new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE),
    [],
  );
  const corniceGeometry = useMemo(
    () => new THREE.BoxGeometry(CELL_SIZE * 1.04, 1.1, CELL_SIZE * 1.04),
    [],
  );
  const wallMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#8a8377",
        map: stoneTexture,
        roughness: 0.98,
        metalness: 0.03,
        emissive: "#27231d",
        emissiveIntensity: 0.09,
      }),
    [stoneTexture],
  );
  const corniceMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#968d81",
        map: stoneTexture,
        roughness: 1,
        metalness: 0.02,
        emissive: "#2d2821",
        emissiveIntensity: 0.08,
      }),
    [stoneTexture],
  );

  return (
    <group>
      <instancedMesh
        args={[wallGeometry, wallMaterial, wallMatrices.length]}
        ref={(mesh) => {
          if (!mesh) {
            return;
          }

          wallMatrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
          mesh.instanceMatrix.needsUpdate = true;
        }}
        castShadow
        receiveShadow
      />

      <instancedMesh
        args={[corniceGeometry, corniceMaterial, corniceMatrices.length]}
        ref={(mesh) => {
          if (!mesh) {
            return;
          }

          corniceMatrices.forEach((matrix, index) =>
            mesh.setMatrixAt(index, matrix),
          );
          mesh.instanceMatrix.needsUpdate = true;
        }}
        castShadow
        receiveShadow
      />
    </group>
  );
}
