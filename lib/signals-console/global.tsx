import { DifficultyType } from "@prisma/client";

import type { Tuto } from "@/types/global";
import type { CellColor, LevelDef } from "@/types/signals-console";

import { easyLevels } from "@/lib/signals-console/levels/easy";
import { hardLevels } from "@/lib/signals-console/levels/hard";
import { mediumLevels } from "@/lib/signals-console/levels/medium";
import { highlightingText } from "@/lib/utils";

export const COLORS: CellColor[] = [
  "blue",
  "red",
  "green",
  "yellow",
  "purple",
  "black",
  "only-red",
  "only-blue",
  "only-green",
  "only-yellow",
  "only-purple",
];

export const COLOR_CLASSES: Record<Exclude<CellColor, null>, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  black: "bg-black opacity-80",
  "only-red": "bg-red-200",
  "only-blue": "bg-blue-200",
  "only-green": "bg-green-200",
  "only-yellow": "bg-yellow-200",
  "only-purple": "bg-purple-200",
};

export const COLOR_HEX: Record<string, string> = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#a855f7",
  black: "#000",
  "only-red": "#fca5a5",
  "only-blue": "#93c5fd",
  "only-green": "#86efac",
  "only-yellow": "#fde047",
  "only-purple": "#d8b4fe",
};

export const LEVELS_BY_DIFFICULTY: Record<DifficultyType, LevelDef[]> = {
  [DifficultyType.easy]: easyLevels,
  [DifficultyType.medium]: mediumLevels,
  [DifficultyType.hard]: hardLevels,
};

// Overlays par difficulté
export const TUTOS_BY_DIFFICULTY: Record<DifficultyType, Record<number, Tuto>> = {
  [DifficultyType.easy]: {
    1: {
      width: "8rem",
      height: "5rem",
      top: "20rem",
      content: `Use the ${highlightingText("reset button")} to restart the level at any time.`,
    },
    2: {
      width: "23rem",
      height: "28.3rem",
      top: "2.7rem",
      content: `Connect all the dots of the ${highlightingText("same color")} by clicking and dragging.`,
    },
    3: {
      width: "23rem",
      height: "28.3rem",
      top: "2.7rem",
      content: `You can only draw ${highlightingText("one path at a time")}. Drawing over an existing path will erase it.`,
    },
  },
  [DifficultyType.medium]: {
    1: {
      width: "23rem",
      height: "28.3rem",
      top: "2.7rem",
      content: `In medium mode, a ${highlightingText("new color")} is added to connect in the grid.`,
    },
    2: {
      width: "23rem",
      height: "28.3rem",
      top: "2.7rem",
      content: `Black cells are ${highlightingText("walls")} — no path can pass through them.`,
    },
  },
  [DifficultyType.hard]: {
    1: {
      width: "23rem",
      height: "28.3rem",
      top: "2.7rem",
      content: `In hard mode, ${highlightingText("restricted cells")} appear — only the matching color can pass through them.`,
    },
    2: {
      width: "23rem",
      height: "28.3rem",
      top: "2.7rem",
      content: `A tinted cell with a ${highlightingText("diamond")} only lets through the path of the same color.`,
    },
  },
};
