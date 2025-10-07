import { DifficultyType, PuzzleType } from "@prisma/client";
import { BoxesIcon, CableIcon, PaintbrushIcon } from "lucide-react";

import type { Game } from "@/types/global";

import { highlightingText } from "@/lib/utils";

export const DIFFICULTIES: DifficultyType[] = [
  DifficultyType.easy,
  DifficultyType.medium,
  DifficultyType.hard,
];

export const GAMES: Game[] = [
  {
    id: 1,
    slug: "overflowing-palette",
    icon: PaintbrushIcon,
    title: "Overflowing Palette",
    description: `Dive into a vibrant tapestry of colors! This puzzle game offers a variety of levels with a ${highlightingText("grid of colored blocks")} that you must transform into a ${highlightingText("single shade")}. With a limited number of moves, choose the right color combination and watch the grid transform! ${highlightingText("Every choice is strategic")}: a single click can repaint everything… or ruin it all!`,
    type: PuzzleType.overflowing_palette,
  },
  {
    id: 2,
    slug: "energy-matrix",
    icon: BoxesIcon,
    title: "Energy Matrix",
    description: `Reconnect the grid’s energy! This puzzle challenges you to fill a grid of gray circles using ${highlightingText("predefined shapes")}. Place them strategically to cover every space without wasting your resources. Some ${highlightingText("shapes")} cover multiple circles at once, it’s up to you to find the perfect combination!`,
    type: PuzzleType.energy_matrix,
  },
  {
    id: 3,
    slug: "signals-console",
    icon: CableIcon,
    title: "Signals Console",
    description: `Become a master of connections! This puzzle challenges you to ${highlightingText("connect the circles")} of the same color ${highlightingText("without crossing the lines")}. Every connection counts, and a single misstep ${highlightingText("can be costly")}. Think carefully, plan ahead, and weave a harmonious network to win the game!`,
    type: PuzzleType.signals_console,
  },
];

export const BADGES = {
  first_steps: {
    index: 0,
    title: "First Steps",
    description: "Complete at least one level",
  },
  easy: {
    index: 1,
    title: "Easy",
    description: "Complete all easy levels of a game",
  },
  medium: {
    index: 2,
    title: "Medium",
    description: "Complete all medium levels of a game",
  },
  hard: {
    index: 3,
    title: "Hard",
    description: "Complete all hard levels of a game",
  },
  overflowing_palette: {
    index: 4,
    title: GAMES[0].title,
    description: "Complete all levels of the Overflowing Palette game",
  },
  energy_matrix: {
    index: 5,
    title: GAMES[1].title,
    description: "Complete all levels of the Energy Matrix game",
  },
  signals_console: {
    index: 6,
    title: GAMES[2].title,
    description: "Complete all levels of the Signals Console game",
  },
  perfectionist: {
    index: 7,
    title: "Perfectionist",
    description: "Complete absolutely all games",
  },
};
