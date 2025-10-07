import type { LevelDef } from "@/types/signals-console";

export const hardLevels: LevelDef[] = [
  {
    id: 1,
    moves: 50,
    grid: [
      [null, null, null, null, "only-purple", null, null, null],
      [null, "purple", null, null, "only-purple", null, "purple", null],
      [null, null, null, null, "only-purple", null, null, null],
      [null, null, null, null, null, "only-purple", "only-purple", "only-purple"],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ["only-yellow", "only-yellow", "only-yellow", null, null, null, null, null],
      [null, null, null, "only-yellow", null, null, null, null],
      [null, "yellow", null, "only-yellow", null, null, "yellow", null],
      [null, null, null, "only-yellow", null, null, null, null],
    ],
  },
  {
    id: 2,
    moves: 61,
    grid: [
      ["red", null, null, "purple", null, null, null, null],
      ["black", "yellow", null, "black", "black", null, "blue", null],
      [null, "only-yellow", null, "purple", "black", null, "black", null],
      [null, "red", "only-red", null, "only-blue", null, "black", null],
      [null, null, "yellow", null, null, "black", "black", "only-purple"],
      ["black", "black", null, null, null, null, null, null],
      [null, null, null, "black", "black", "green", null, null],
      [null, "black", null, null, null, "only-green", null, null],
      [null, "green", null, "black", "blue", null, null, null],
      [null, null, null, null, null, null, null, null],
    ],
  },
];
