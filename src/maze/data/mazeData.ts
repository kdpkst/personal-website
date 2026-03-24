export const WALL = 1;
export const PATH = 0;

export const MAZE_SIZE = 25;
export const CELL_SIZE = 5.5;

const START_CHAMBER = {
  top: 1,
  left: 1,
  height: 5,
  width: 7,
};

export const PLAYER_START = { row: 3, col: 3 };
export const PLAYER_START_VIEW = {
  yaw: -Math.PI * 0.32,
  pitch: -0.03,
};

export interface GridPosition {
  row: number;
  col: number;
}

export interface PortalInfo {
  row: number;
  col: number;
  route: string;
  label: string;
  color: string;
  orientation: "north" | "south" | "east" | "west";
}

function createSeededRandom(seed: number) {
  let value = seed >>> 0;

  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 0xffffffff;
  };
}

function shuffleDirections<T>(items: readonly T[], random: () => number) {
  const next = [...items] as T[];

  for (let index = next.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [next[index], next[swapIndex]] = [next[swapIndex], next[index]];
  }

  return next;
}

function carveRoom(
  grid: number[][],
  top: number,
  left: number,
  height: number,
  width: number,
) {
  for (let row = top; row < top + height; row += 1) {
    for (let col = left; col < left + width; col += 1) {
      if (
        row > 0 &&
        row < MAZE_SIZE - 1 &&
        col > 0 &&
        col < MAZE_SIZE - 1
      ) {
        grid[row][col] = PATH;
      }
    }
  }
}

function generateMazeGrid() {
  const grid = Array.from({ length: MAZE_SIZE }, () =>
    Array(MAZE_SIZE).fill(WALL),
  );
  const random = createSeededRandom(73421);
  const directions = [
    [0, 2],
    [0, -2],
    [2, 0],
    [-2, 0],
  ] as const;

  const carve = (row: number, col: number) => {
    grid[row][col] = PATH;

    for (const [dRow, dCol] of shuffleDirections(directions, random)) {
      const nextRow = row + dRow;
      const nextCol = col + dCol;

      if (
        nextRow <= 0 ||
        nextRow >= MAZE_SIZE - 1 ||
        nextCol <= 0 ||
        nextCol >= MAZE_SIZE - 1
      ) {
        continue;
      }

      if (grid[nextRow][nextCol] === PATH) {
        continue;
      }

      grid[row + dRow / 2][col + dCol / 2] = PATH;
      carve(nextRow, nextCol);
    }
  };

  carve(PLAYER_START.row, PLAYER_START.col);

  carveRoom(
    grid,
    START_CHAMBER.top,
    START_CHAMBER.left,
    START_CHAMBER.height,
    START_CHAMBER.width,
  );
  carveRoom(grid, 5, 15, 5, 5);
  carveRoom(grid, 11, 7, 3, 7);
  carveRoom(grid, 15, 3, 5, 5);
  carveRoom(grid, 17, 17, 5, 5);

  for (let col = 19; col <= 23; col += 1) {
    grid[23][col] = PATH;
  }

  for (let row = 17; row <= 23; row += 1) {
    grid[row][19] = PATH;
  }

  return grid;
}

export const MAZE_GRID = generateMazeGrid();

export const PORTALS: PortalInfo[] = [
  {
    row: 23,
    col: 23,
    route: "/about",
    label: "Stone Door",
    color: "#d6c4a3",
    orientation: "east",
  },
];

function buildGuideMap(target: GridPosition) {
  const nextStepMap = Array.from({ length: MAZE_SIZE }, () =>
    Array<GridPosition | null>(MAZE_SIZE).fill(null),
  );
  const visited = Array.from({ length: MAZE_SIZE }, () =>
    Array(MAZE_SIZE).fill(false),
  );
  const queue: GridPosition[] = [target];
  const directions = [
    { row: 1, col: 0 },
    { row: -1, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: -1 },
  ];

  visited[target.row][target.col] = true;

  while (queue.length > 0) {
    const current = queue.shift();

    if (!current) {
      continue;
    }

    for (const direction of directions) {
      const nextRow = current.row + direction.row;
      const nextCol = current.col + direction.col;

      if (!isWalkable(nextRow, nextCol) || visited[nextRow][nextCol]) {
        continue;
      }

      visited[nextRow][nextCol] = true;
      nextStepMap[nextRow][nextCol] = current;
      queue.push({ row: nextRow, col: nextCol });
    }
  }

  return nextStepMap;
}

const EXIT_GUIDE_MAP = buildGuideMap({
  row: PORTALS[0].row,
  col: PORTALS[0].col,
});

export function gridToWorld(row: number, col: number): [number, number, number] {
  const offset = (MAZE_SIZE * CELL_SIZE) / 2;
  return [
    col * CELL_SIZE - offset + CELL_SIZE / 2,
    0,
    row * CELL_SIZE - offset + CELL_SIZE / 2,
  ];
}

export function worldToGrid(x: number, z: number) {
  const offset = (MAZE_SIZE * CELL_SIZE) / 2;

  return {
    row: Math.floor((z + offset) / CELL_SIZE),
    col: Math.floor((x + offset) / CELL_SIZE),
  };
}

export function isWalkable(row: number, col: number) {
  if (row < 0 || row >= MAZE_SIZE || col < 0 || col >= MAZE_SIZE) {
    return false;
  }

  return MAZE_GRID[row][col] !== WALL;
}

export function isCollidingWithWall(x: number, z: number, radius: number) {
  const { row, col } = worldToGrid(x, z);

  for (let testRow = row - 1; testRow <= row + 1; testRow += 1) {
    for (let testCol = col - 1; testCol <= col + 1; testCol += 1) {
      if (!isWalkable(testRow, testCol)) {
        const [cellX, , cellZ] = gridToWorld(testRow, testCol);
        const halfSize = CELL_SIZE / 2;
        const overlapsX = Math.abs(x - cellX) < halfSize + radius;
        const overlapsZ = Math.abs(z - cellZ) < halfSize + radius;

        if (overlapsX && overlapsZ) {
          return true;
        }
      }
    }
  }

  return false;
}

export function getPortalWorldPosition(portal: PortalInfo) {
  const [x, y, z] = gridToWorld(portal.row, portal.col);
  const half = CELL_SIZE / 2;

  switch (portal.orientation) {
    case "north":
      return { x, y, z: z - half, rotationY: Math.PI };
    case "south":
      return { x, y, z: z + half, rotationY: 0 };
    case "west":
      return { x: x - half, y, z, rotationY: Math.PI / 2 };
    case "east":
    default:
      return { x: x + half, y, z, rotationY: -Math.PI / 2 };
  }
}

export function getPathToDoor(startRow: number, startCol: number) {
  if (!isWalkable(startRow, startCol)) {
    return [];
  }

  const route: GridPosition[] = [{ row: startRow, col: startCol }];
  let current = EXIT_GUIDE_MAP[startRow][startCol];
  let steps = 0;
  const maxSteps = MAZE_SIZE * MAZE_SIZE;

  while (current && steps < maxSteps) {
    route.push(current);

    if (current.row === PORTALS[0].row && current.col === PORTALS[0].col) {
      break;
    }

    current = EXIT_GUIDE_MAP[current.row][current.col];
    steps += 1;
  }

  return route;
}
