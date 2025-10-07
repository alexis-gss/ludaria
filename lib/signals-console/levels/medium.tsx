import type { LevelDef } from "@/types/signals-console";

export const mediumLevels: LevelDef[] = [
  {
    id: 1,
    moves: 50,
    grid: [
      [null, null, null, null, null, null, null, null],
      [null, "yellow", null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["black", "black", "black", "black", "black", "black", "black", null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, "black", "black", "black", "black", "black", "black", "black"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, "yellow", null],
      [null, null, null, null, null, null, null, null],
    ],
  },
  {
    id: 2,
    moves: 10,
    grid: [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
    ],
  },
];
