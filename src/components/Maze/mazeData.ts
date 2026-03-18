// Maze cell types
export const WALL = 1;
export const PATH = 0;
export const PORTAL_ABOUT = 2;
export const PORTAL_BLOG = 3;
export const PORTAL_PORTFOLIO = 4;

// 15x15 maze grid (row-major)
// 1 = wall, 0 = path, 2/3/4 = portals
export const MAZE_GRID: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 1],
  [1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1, 3, 0, 0, 1, 4, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const MAZE_SIZE = MAZE_GRID.length;
export const CELL_SIZE = 2; // world units per cell

// Player start position (grid coordinates)
export const PLAYER_START = { row: 1, col: 1 };

// Portal definitions
export interface PortalInfo {
  row: number;
  col: number;
  route: string;
  label: string;
  color: string;
}

export const PORTALS: PortalInfo[] = [
  { row: 11, col: 3, route: '/about', label: 'About Me', color: '#00cec9' },
  { row: 13, col: 9, route: '/blogs', label: 'My Blogs', color: '#fd79a8' },
  { row: 13, col: 13, route: '/portfolio', label: 'Portfolio', color: '#fdcb6e' },
];

// Helper: convert grid coords to world position
export function gridToWorld(row: number, col: number): [number, number, number] {
  const offset = (MAZE_SIZE * CELL_SIZE) / 2;
  return [col * CELL_SIZE - offset + CELL_SIZE / 2, 0, row * CELL_SIZE - offset + CELL_SIZE / 2];
}

// Helper: check if a grid cell is walkable
export function isWalkable(row: number, col: number): boolean {
  if (row < 0 || row >= MAZE_SIZE || col < 0 || col >= MAZE_SIZE) return false;
  return MAZE_GRID[row][col] !== WALL;
}
