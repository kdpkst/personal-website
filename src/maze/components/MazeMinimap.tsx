import { useMemo } from "react";
import {
  MAZE_GRID,
  MAZE_SIZE,
  PATH,
  PLAYER_START,
  PORTALS,
  WALL,
  getPathToDoor,
  type GridPosition,
} from "../data/mazeData";

interface MazeMinimapProps {
  playerCell: GridPosition;
}

const EXIT_DOOR = PORTALS[0];

export default function MazeMinimap({ playerCell }: MazeMinimapProps) {
  const guidePath = useMemo(
    () => getPathToDoor(playerCell.row, playerCell.col),
    [playerCell.col, playerCell.row],
  );

  const guidePoints = guidePath
    .map((cell) => `${cell.col + 0.5},${cell.row + 0.5}`)
    .join(" ");

  return (
    <div className="pointer-events-none absolute left-6 top-6 z-20">
      <div className="glass rounded-panel border border-white/18 bg-[rgba(10,10,15,0.78)] px-3 py-3 shadow-[0_12px_28px_rgba(0,0,0,0.34)] sm:px-4 sm:py-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-text-secondary">
            Maze Map
          </span>
          <span className="text-[0.6rem] uppercase tracking-[0.08em] text-text-muted">
            Door path
          </span>
        </div>

        <div className="overflow-hidden rounded-[12px] border border-white/8 bg-[rgba(26,22,18,0.9)] p-2 shadow-[inset_0_0_24px_rgba(0,0,0,0.35)]">
          <svg
            viewBox={`0 0 ${MAZE_SIZE} ${MAZE_SIZE}`}
            className="block h-[108px] w-[108px] sm:h-[126px] sm:w-[126px]"
            role="img"
            aria-label="Maze minimap showing your position and the exit door"
          >
            <rect width={MAZE_SIZE} height={MAZE_SIZE} fill="#1a1714" />

            {MAZE_GRID.map((rowData, row) =>
              rowData.map((cell, col) => (
                <rect
                  key={`${row}-${col}`}
                  x={col}
                  y={row}
                  width="1"
                  height="1"
                  rx="0.12"
                  fill={cell === WALL ? "#726c63" : "#302923"}
                  opacity={cell === PATH ? 0.96 : 1}
                />
              )),
            )}

            {guidePoints && (
              <polyline
                points={guidePoints}
                fill="none"
                stroke="#b7c2a4"
                strokeWidth="0.34"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.95"
              />
            )}

            <circle
              cx={EXIT_DOOR.col + 0.5}
              cy={EXIT_DOOR.row + 0.5}
              r="0.42"
              fill="#d8c39d"
              stroke="#f3ead8"
              strokeWidth="0.12"
            />
            <circle
              cx={playerCell.col + 0.5}
              cy={playerCell.row + 0.5}
              r="0.38"
              fill="#f5f0e5"
              stroke="#ffffff"
              strokeWidth="0.12"
            />
            <circle
              cx={PLAYER_START.col + 0.5}
              cy={PLAYER_START.row + 0.5}
              r="0.22"
              fill="#88a5b4"
              opacity="0.85"
            />
          </svg>
        </div>

        <div className="mt-3 flex items-center gap-3 text-[0.62rem] uppercase tracking-[0.08em] text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#f5f0e5]" />
            You
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#d8c39d]" />
            Door
          </span>
        </div>
      </div>
    </div>
  );
}
