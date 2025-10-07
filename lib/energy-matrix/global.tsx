import { DifficultyType } from "@prisma/client";

import type { Color, LevelDef } from "@/types/energy-matrix";
import type { Tuto } from "@/types/global";

import { easyLevels } from "@/lib/energy-matrix/levels/easy";
import { hardLevels } from "@/lib/energy-matrix/levels/hard";
import { mediumLevels } from "@/lib/energy-matrix/levels/medium";
import { highlightingText } from "@/lib/utils";

export const COLORS: Color[] = ["blue", "red", "green"];

export const COLOR_CLASSES: Record<Color, string> = {
  blue: "bg-blue-500",
  red: "bg-red-500",
  green: "bg-green-500",
  yellow: "bg-yellow-500",
  purple: "bg-purple-500",
  black: "bg-black opacity-80",
  frozen: "bg-cyan-200",
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
  },
  [DifficultyType.medium]: {
    1: {
      width: "20rem",
      height: "6rem",
      top: "20.5rem",
      content: `In medium mode, a ${highlightingText("new color")} is available in the selection.`,
    },
  },
  [DifficultyType.hard]: {
    1: {
      width: "24rem",
      height: "6rem",
      top: "20.5rem",
      content: `In hard mode, a ${highlightingText("new color")} is available in the selection`,
    },
  },
};
