import { useMemo } from 'react';
import * as THREE from 'three';
import { MAZE_GRID, MAZE_SIZE, CELL_SIZE, WALL } from '../data/mazeData';

const WALL_HEIGHT = 2.5;

export default function MazeWalls() {
  const { meshData, count } = useMemo(() => {
    const positions: THREE.Matrix4[] = [];
    for (let row = 0; row < MAZE_SIZE; row++) {
      for (let col = 0; col < MAZE_SIZE; col++) {
        if (MAZE_GRID[row][col] === WALL) {
          const matrix = new THREE.Matrix4();
          const offset = (MAZE_SIZE * CELL_SIZE) / 2;
          matrix.setPosition(
            col * CELL_SIZE - offset + CELL_SIZE / 2,
            WALL_HEIGHT / 2,
            row * CELL_SIZE - offset + CELL_SIZE / 2
          );
          positions.push(matrix);
        }
      }
    }
    return { meshData: positions, count: positions.length };
  }, []);

  const geometry = useMemo(() => new THREE.BoxGeometry(CELL_SIZE, WALL_HEIGHT, CELL_SIZE), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#3a3a6e',
        roughness: 0.6,
        metalness: 0.4,
        emissive: '#1a1a3e',
        emissiveIntensity: 0.15,
      }),
    []
  );

  return (
    <instancedMesh
      args={[geometry, material, count]}
      ref={(mesh) => {
        if (mesh) {
          meshData.forEach((m, i) => mesh.setMatrixAt(i, m));
          mesh.instanceMatrix.needsUpdate = true;
        }
      }}
      castShadow
      receiveShadow
    />
  );
}
