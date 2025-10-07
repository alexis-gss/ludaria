import type { LevelDef } from "@/types/overflowing-palette";

export const hardLevels: LevelDef[] = [
  {
    id: 1,
    moves: 2,
    target: "purple",
    grid: [
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "frozen", "frozen", "frozen", "frozen", "blue", "blue"],
      ["blue", "blue", "frozen", "frozen", "frozen", "frozen", "blue", "blue"],
      ["blue", "blue", "frozen", "frozen", "frozen", "frozen", "blue", "blue"],
      ["blue", "blue", "frozen", "frozen", "frozen", "frozen", "blue", "blue"],
      ["blue", "blue", "frozen", "frozen", "frozen", "frozen", "blue", "blue"],
      ["blue", "blue", "frozen", "frozen", "frozen", "frozen", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
    ],
    unfreezeAfter: 1,
    unfreezeColor: "blue",
  },
  {
    id: 2,
    moves: 5,
    target: "blue",
    grid: [
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
      ["blue", "blue", "blue", "blue", "blue", "blue", "blue", "blue"],
    ],
    unfreezeAfter: 1,
    unfreezeColor: "blue",
  },
];
