import type { LevelDef } from "@/types/energy-matrix";

export const hardLevels: LevelDef[] = [
  {
    id: 1,
    grid: { rows: 6, cols: 6 },
    // targets = positions à remplir (exemple simple)
    targets: [
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 3, y: 1 },
      { x: 1, y: 2 },
      { x: 3, y: 2 },
      { x: 1, y: 3 },
      { x: 2, y: 3 },
      { x: 3, y: 3 },
    ],
    shapes: [
      // L de 3 (forme A)
      {
        id: "A",
        name: "L-3",
        color: "#60a5fa",
        offsets: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ],
      },
      // ligne de 3 (forme B)
      {
        id: "B",
        name: "Line-3",
        color: "#f472b6",
        offsets: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 2, y: 0 },
        ],
      },
      // petit carré (2x2) - représenté par 4 octogones
      {
        id: "C",
        name: "Block-2",
        color: "#34d399",
        offsets: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 0, y: 1 },
          { x: 1, y: 1 },
        ],
      },
    ],
  },
];
