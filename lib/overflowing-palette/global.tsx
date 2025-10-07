import { DifficultyType } from "@prisma/client";

import type { Tuto } from "@/types/global";
import type { Color, LevelDef } from "@/types/overflowing-palette";

import { easyLevels } from "@/lib/overflowing-palette/levels/easy";
import { hardLevels } from "@/lib/overflowing-palette/levels/hard";
import { mediumLevels } from "@/lib/overflowing-palette/levels/medium";
import { highlightingText } from "@/lib/utils";

export const COLORS: Color[] = ["blue", "red", "green", "yellow", "purple"];

export const COLOR_CLASSES: Record<Color, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  black: "bg-black opacity-80",
  frozen: "bg-cyan-200",
};

export const COLOR_HEX: Record<Color, string> = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  yellow: "#eab308",
  purple: "#8b5cf6",
  black: "#000",
  frozen: "#22d3ee",
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
      width: "16rem",
      height: "6rem",
      top: "20.5rem",
      content: `A ${highlightingText("selection of colors")} is available; click on one or use the keyboard shortcut to select a color.`,
    },
    2: {
      width: "23rem",
      height: "28.3rem",
      top: "3.7rem",
      content: `Click on a cell to ${highlightingText("fill it")} with the selected color; ${highlightingText("adjacent cells")} of the ${highlightingText("same color")} will also be affected by your selection.`,
    },
    3: {
      width: "5.5rem",
      height: "2.2rem",
      top: "-11.2rem",
      left: "8.80rem",
      content: `The goal of this puzzle is to color the entire grid with the ${highlightingText("expected color")}.`,
    },
    4: {
      width: "10rem",
      height: "2.2rem",
      top: "-11.2rem",
      left: "-6.5rem",
      content: `A ${highlightingText("maximum number of moves")} is imposed in each level, you lose when the counter reaches 0.`,
    },
  },
  [DifficultyType.medium]: {
    1: {
      width: "20rem",
      height: "6rem",
      top: "20.5rem",
      content: `In medium mode, a ${highlightingText("new color")} is available in the selection.`,
    },
    2: {
      width: "23rem",
      height: "28.3rem",
      top: "3.7rem",
      content: `The new ${highlightingText("disabled cell")} also appears in the grid, it is not selectable or colorable.`,
    },
  },
  [DifficultyType.hard]: {
    1: {
      width: "24rem",
      height: "6rem",
      top: "20.5rem",
      content: `In hard mode, a ${highlightingText("new color")} is available in the selection`,
    },
    2: {
      width: "23rem",
      height: "28.3rem",
      top: "3.7rem",
      content: `The new ${highlightingText("frozen cell")} also appears in the grid, it becomes unfrozen after one action on the grid`,
    },
  },
};
